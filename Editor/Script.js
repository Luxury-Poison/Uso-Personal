const codeInput = document.getElementById("codeInput");
const variablesPanel = document.getElementById("variablesPanel");
const preview = document.getElementById("preview");

let currentCode = "";
let variables = [];

codeInput.addEventListener("input", analyzeCode);

function analyzeCode() {

    currentCode = codeInput.value;

    variables = [];

    const regex = /(--[\w-]+)\s*:\s*([^;]+);?/g;

    let match;
    let id = 0;

    while ((match = regex.exec(currentCode)) !== null) {

        variables.push({
            id: id++,
            name: match[1],
            value: match[2].trim(),
            start: match.index,
            fullMatch: match[0]
        });

    }

    renderVariables();
    updatePreview();
}

function renderVariables() {

    variablesPanel.innerHTML = "";

    variables.forEach(variable => {

        const box = document.createElement("div");
        box.className = "variable";

        const label = document.createElement("label");
        label.textContent = variable.name;

        let input;

        const type = detectType(variable.value);

        if (type === "color") {

    const wrapper = document.createElement("div");

    wrapper.style.display = "flex";
    wrapper.style.gap = "8px";

    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = variable.value;

    const colorText = document.createElement("input");
    colorText.type = "text";
    colorText.value = variable.value;

    colorPicker.addEventListener("input", () => {

        colorText.value = colorPicker.value;

        updateVariable(
            variable.id,
            colorPicker.value,
            type
        );

    });

    colorText.addEventListener("input", () => {

        if(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(colorText.value)){

            colorPicker.value = colorText.value;

            updateVariable(
                variable.id,
                colorText.value,
                type
            );

        }

    });

    wrapper.appendChild(colorPicker);
    wrapper.appendChild(colorText);

    box.appendChild(label);
    box.appendChild(wrapper);

    variablesPanel.appendChild(box);

    return;

} else if (type === "number") {

            input = document.createElement("input");
            input.type = "number";
            input.value = variable.value;

        } else {

            input = document.createElement("input");
            input.type = "text";
            input.value = cleanValue(variable.value);

        }

        input.addEventListener("input", () => {

            updateVariable(
                variable.id,
                input.value,
                type
            );

        });

        box.appendChild(label);
        box.appendChild(input);

        if (type === "image") {

            const img = document.createElement("img");

            img.src = extractUrl(variable.value);

            box.appendChild(img);

        }

        variablesPanel.appendChild(box);

    });

}

function detectType(value) {

    value = value.trim();

    if (/^#([0-9a-f]{3,8})$/i.test(value))
        return "color";

    if (/^-?\d+(\.\d+)?$/.test(value))
        return "number";

    if (/^url\(/i.test(value))
        return "image";

    if (/^https?:\/\//i.test(value))
        return "url";

    return "text";
}

function cleanValue(value) {

    if (/^url\(/i.test(value)) {

        return extractUrl(value);

    }

    if (
        (value.startsWith("'") && value.endsWith("'"))
        ||
        (value.startsWith('"') && value.endsWith('"'))
    ) {

        return value.slice(1, -1);

    }

    return value;
}

function extractUrl(value) {

    const match = value.match(/url\((.*?)\)/i);

    return match ? match[1] : value;
}

function updateVariable(id, newValue, type) {

    const variable = variables.find(v => v.id === id);

    if (!variable) return;

    let finalValue = newValue;

    if (type === "image") {

        finalValue = `url(${newValue})`;

    } else if (type === "text") {

        if (
            variable.value.startsWith("'")
            ||
            variable.value.startsWith('"')
        ) {

            finalValue = `'${newValue}'`;

        }

    }

    const escaped = escapeRegex(variable.fullMatch);

    currentCode = currentCode.replace(
        new RegExp(escaped),
        `${variable.name}: ${finalValue};`
    );

    variable.value = finalValue;
    variable.fullMatch = `${variable.name}: ${finalValue};`;

    codeInput.value = currentCode;

    updatePreview();
}

function updatePreview() {

    preview.srcdoc = currentCode;

}

function escapeRegex(str) {

    return str.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

}



const copyBtn =
document.getElementById("copyCodeBtn");

copyBtn.addEventListener(
    "click",
    async () => {

        try{

            await navigator.clipboard.writeText(
                codeInput.value
            );

            copyBtn.textContent =
                "✓ Copiado";

            copyBtn.classList.add(
                "copied"
            );

            setTimeout(() => {

                copyBtn.textContent =
                    "Copiar";

                copyBtn.classList.remove(
                    "copied"
                );

            }, 2000);

        }catch(err){

            alert(
                "No se pudo copiar el código."
            );

        }

    }
);
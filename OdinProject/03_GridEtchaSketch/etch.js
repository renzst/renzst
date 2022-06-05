function generateRGBValue() {
    let r = Math.floor(255 * Math.random());
    let g = Math.floor(255 * Math.random());
    let b = Math.floor(255 * Math.random());
    return `rgb(${r}, ${g}, ${b}, 1.0)`;
}

const r = document.querySelector(':root');

const cellSubmitBtn = document.querySelector("#cell-submit");
const cells = document.querySelector("#n-cells");

const sketchGrid = document.querySelector(".sketchGrid");

const functionChoices = document.querySelector("#function");

cellSubmitBtn.addEventListener("click", () => {
    let ncell = cells.value;
    let funcOption = functionChoices.value;

    if (ncell < 1 | ncell > 100) {
        console.error("Invalid width");
        return;
    }
    r.style.setProperty("--ncell", ncell);
    for (child of document.querySelectorAll(".sketchGrid > *")) {
        child.remove();
    };
    for (let i = 0; i < Math.pow(ncell, 2); ++i) {
        let cell = document.createElement("div");
        cell.classList.add('cell');
        cell.mouseovers = 0;

        switch (funcOption) {
            case "Rainbow" : {
                cell.addEventListener("mouseover", () => cell.style.backgroundColor = generateRGBValue());
                break;
            }
            case "Darken" : {
                cell.addEventListener("mouseover", () => {
                    if (cell.mouseovers <= 10) {
                        cell.mouseovers += 1;
                        cell.style.backgroundColor = `hsl(0, 0%, ${100 - 10*cell.mouseovers}%)`;
                    };
                });
                break;
            }

            default : {
                cell.addEventListener("mouseover", () => cell.style.backgroundColor = "black");
                break;
            };
        };
        sketchGrid.appendChild(cell);
    }
});
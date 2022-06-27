const randomRGB = () => {
    const r = Math.floor(255 * Math.random());
    const g = Math.floor(255 * Math.random());
    const b = Math.floor(255 * Math.random());

    const CSS = `rgb(${r}, ${g}, ${b}, 1.0)`;

    return {r,g,b,CSS}
}

const Grid = () => {
    // parameter controllers
    const params = (() => {
        const resolution = document.querySelector("#resolution");
        const fns = document.querySelector("#functions");
        const submit = document.querySelector("#cell-submit");
        const getValues = () => {
            return {
                resolution: resolution.value,
                fn: fns.value
            }
        }

        return {resolution, fns, submit, getValues};
    })();

    const grid = document.querySelector(".sketchGrid");

    let height = grid.offsetHeight;
    let width = grid.offsetWidth;

    window.addEventListener("resize", () => {
        height = grid.offsetHeight;
        width = grid.offsetWidth;
    })

    const addCell = (fn, ...classes) => {
        let div = document.createElement("div");
        div.classList.add("cell");
        if (classes) {
            for (let class_ of classes) {
                div.classList.add(class_);
            }
        }

        div.mouseovers = 0;
        if (fn == "Rainbow") {
            div.addEventListener("mouseover", () => {div.style.backgroundColor = randomRGB().CSS})}
        else if (fn == "Darken") {
            div.addEventListener("mouseover", () => {
                if (div.mouseovers <= 10) {
                    div.mouseovers += 1;
                    div.style.backgroundColor = `hsl(0, 0%, ${100 - 10*div.mouseovers}%)`;
                }});
        }
        else {
            div.addEventListener("mouseover", () => div.style.backgroundColor = "black");
        };

        grid.append(div);
    }

    const calcGrid = (resChoice) => {
        const resolutions = [100, 60, 30, 15, 10];
        let cellSize = resolutions[resChoice - 1];
        return {
            rows: Math.floor(height / cellSize),
            columns: Math.floor(width / cellSize),
            cellSize,
        }
    }

    const setGrid = (gridProps) => {
        grid.style.setProperty("--r", `${gridProps.rows}`);
        grid.style.setProperty("--c", `${gridProps.columns}`);
        grid.style.setProperty("--cell", `${gridProps.cellSize}px`);
    }

    const clearGrid = () => {
        for (let cell of document.querySelectorAll(".sketchGrid > :not(#sketchGridMenu")) {
            cell.remove();
        }
    }

    return {
        grid,
        params,
        addCell,
        calcGrid,
        setGrid,
        clearGrid
    }
}


const main = () => {
    const display = Grid();

    display.params.submit.addEventListener("click", () => {
        let params = display.params.getValues();
        display.clearGrid();
        let gridProp = display.calcGrid(params.resolution);
        display.setGrid(gridProp);
        for (let i = 0; i < gridProp.rows * gridProp.columns; i++) {
            display.addCell(params.fn);
        } 
    })
}

main();
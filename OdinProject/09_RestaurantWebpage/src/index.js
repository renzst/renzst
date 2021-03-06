import './style.css';
import G1 from './groceries/g1.jpg';
import S1 from './salad/s1.jpg';
import S2 from './salad/s2.jpg';
import S3 from './salad/s3.jpg';
import F1 from './friends/f1.jpg';
import F2 from './friends/f2.jpg';

const Header = (() => {
    const wrapper = document.createElement("header");

    const h1 = document.createElement("h1");
    h1.textContent = "Free Grocery Store";

    const motto = document.createElement("div");
    motto.classList.add("motto");

    const mottoText = document.createElement("p");
    mottoText.textContent = "Giving out groceries, free, from our store, since 2020..."

    motto.appendChild(mottoText);

    [h1, motto].forEach(child => wrapper.appendChild(child));

    return wrapper;
})();

function deactivateAllButtons() {
    const buttons = document.querySelectorAll("menu > button");
    for (let button of buttons) {
        button.disabled = false;
        if (button.classList.contains("active")) {
            button.classList.remove("active");
        }
    }
}

function addDelayToChildren(children, interval = 10) {
    let i = 0;
    for (let child of children) {
        child.style.animationDelay = i / interval + "s";
        i++;
    }
}

const About = (() => {
    const wrapper = document.createElement("main");
    wrapper.classList.add("about");

    const intro = document.createElement("p");
    intro.textContent = "We're Free Grocery Store! We give groceries to people from our store, for free.";

    const more = document.createElement("p");
    more.textContent = "We operate mostly by delivery, but we also will pop in your neighborhood to give groceries to people, for free.";

    const henlo = new Image();
    henlo.src = G1;

    [intro, more, henlo].forEach(child => wrapper.appendChild(child));

    let i = 0;
    addDelayToChildren(wrapper.children);

    return wrapper;
})();

const GetFood = (() => {
    const wrapper = document.createElement("main");
    wrapper.classList.add("getFood");

    const p1 = document.createElement("p");
    p1.textContent = "Looking to get food?";
    wrapper.appendChild(p1);

    [S1, S2, S3].forEach((img) => {
        let div = new Image();
        div.src = img;
        wrapper.appendChild(div);
    })

    let h2text = "sorry";
    const h2 = document.createElement("h2");
    h2.id = "sorry";
    for (let i = 0; i < h2text.length; i++) {
        let span = document.createElement("span");
        span.textContent = h2text.slice(i, i+1);
        span.style.animationDelay = i/10 + "s";
        h2.appendChild(span);
    }
    /* const p2 = document.createElement("p");
    p2.textContent = "Sorry"; */
    wrapper.appendChild(h2);

    addDelayToChildren(wrapper.children);

    return wrapper;
})();

const Contact = (() => {
    const wrapper = document.createElement("main");
    wrapper.classList.add("contact");

    const p1 = document.createElement("p");
    p1.textContent = "We're looking forward to your potato...";
    wrapper.appendChild(p1);

    [F1, F2].forEach((img) => {
        let div = new Image();
        div.src = img;
        wrapper.appendChild(div);
    })

    const h2 = document.createElement("h2");
    h2.textContent = "(352) 352-3522";

    wrapper.appendChild(h2);

    addDelayToChildren(wrapper.children);

    return wrapper;

})();

const Menu = (() => {
    const wrapper = document.createElement("menu");

    for (let button of ["about", "getFood", "contact"]) {
        let b = document.createElement("button");
        b.classList.add(button);
        if (button == "about") {b.classList.add("active")};
        b.textContent = button == "getFood" ? "Get Food" : button.toUpperCase();

        let content;
        if (button == "about") {content = About}
        else if (button == "getFood") {content = GetFood}
        else if (button == "contact") {content = Contact}
        else {};

        b.addEventListener("click", () => {
            deactivateAllButtons();
            b.classList.add("active");
            b.disabled = true;
            document.querySelector("main").remove();
            document.querySelector("#content").appendChild(content);
        });

        wrapper.appendChild(b);
    }

    return wrapper;
})();

function main() {
    const anchor = document.querySelector("#content");
    let main = About;
    [Header, Menu, main].forEach(element => anchor.appendChild(element));
}

main();
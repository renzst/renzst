import _ from 'lodash';
// import './style.css'; // requires a rule in webpack.config.js, style-loader and css-loader installed
import printMe from './print.js';
/* import Hello from './hello.jpg'; // requires a rule in config of type asset/resource
import Data from './data.xml';
import Notes from './data.csv';
import toml from './data.toml'; // requires rules, package to be loaded (csv-loader) and use declared
import yaml from './data.yaml';
import json from './data.json5'; */

/* console.log(toml.title); // output `TOML Example`
console.log(toml.owner.name); // output `Tom Preston-Werner`
console.log(yaml.title); // output `YAML Example`
console.log(yaml.owner.name); // output `Tom Preston-Werner`
console.log(json.title); // output `JSON5 Example`
console.log(json.owner.name); // output `Tom Preston-Werner` */
// import myName from './myName';

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  btn.innerHTML = 'Click me and check the console';
  btn.addEventListener("click", printMe());
  element.appendChild(btn);
/*   element.classList.add('hello');

  const myHello = new Image();
  myHello.src = Hello;

  element.appendChild(myHello);

  console.log(Data);
  console.log(Notes);
  // use your function!
  // element.textContent = myName('Cody');
 */

  return element;
}

document.body.appendChild(component());

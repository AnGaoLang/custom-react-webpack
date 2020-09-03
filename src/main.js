import { debounce } from 'lodash';
import logo from './logo.png';
import './style.css';
import './style1.scss';
import print from './print.js';
import { cube } from './module.js';

print();
console.log(PRODUCTION)
function component() {
  var element = document.createElement('div');

  // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  // element.innerHTML = join(['Hello', 'webpack'], ' ');
  element.innerHTML = [
    'Hello webpack!',
    '5 cubed is equal to ' + cube(5)
  ].join('\n\n');
  element.classList.add('hello');
  var myIcon = new Image();
  myIcon.src = logo;
  
  element.appendChild(myIcon);
  return element;
}
console.log(12313123131313)
document.body.appendChild(component());
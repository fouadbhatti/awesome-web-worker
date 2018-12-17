import "@babel/polyfill";
import * as Comlink from 'comlinkjs';
import Rx from 'rxjs/Rx';
import Worker from './compute.worker.js';


class App {
  constructor() {
    this.ui();
    this.regiserEvents();
    this.counter = 0;
  }

  regiserEvents() {
    this.btnStart.addEventListener('click', (event) => {
      const timer = this.input.value;
      this.startWorker(timer);
    });
  }

  ui() {
    this.btnStart = document.createElement("BUTTON");
    const tStart = document.createTextNode("START WORKER");
    this.btnStart.appendChild(tStart);

    this.input = document.createElement("INPUT");
    document.body.appendChild(this.btnStart);
    document.body.appendChild(this.input);
  }

  stopWorker() {
    this.workerInstance.terminate();
  }

  randomNumber(length = 100000) {
    return Math.round(Math.random() * length);
  }

  async startWorker(timer) {
    this.workerInstance = new Worker();
    const insertionSortClass = Comlink.proxy(this.workerInstance);
    this.sortInstance = await new insertionSortClass();

    this.startSorting().then((data) => {
      console.log(data);
    });

    let interval = setInterval(() => {
      this.restart();
      this.counter++;
      if (this.counter === 10) clearInterval(interval);
    }, timer);
  }

  async restart() {
    let pause = await this.sortInstance.pauseSort();
    console.log('Paused Sort');
    let addRandom = await this.sortInstance.addToSort(this.randomNumber());
    console.log('Added Random Number');
    let restart = this.startSorting().then((data) => {
      console.log('Continuing Sort');
      console.log(data);
    });
  };

  startSorting() {
    console.log('Started Sort');
    let sortInstance = this.sortInstance;
    return new Promise((resolve, reject) => {
      this.sortT0 = performance.now();
      sortInstance.sort(Comlink.proxyValue((data) => {
        if (data.message == 'Array Sorted') {
          this.sortT1 = performance.now();
          console.log(`SORT PERFORMANCE: ${this.sortT1 - this.sortT0 }`);
        }
        resolve(data);
      }));
    });
  }
}

const app = new App();
import "@babel/polyfill";
import * as Comlink from 'comlinkjs';
import Rx from 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';
import Worker from './compute.worker.js';

class App {
  constructor() {
    const sampleSize = 100000;
    this.sample = this.createSample(sampleSize);
    this.ui();
    this.registerEvents();
  }

  registerEvents() {
    this.btnStart.addEventListener('click', (event) => {
      const timer = this.input.value;
      console.log("GRAB A COFFEE - COMPUTING SORT ☕");
      this.sort(this.sample, timer)
        .subscribe();
    });
  }

  ui() {
    this.btnStart = document.createElement("BUTTON");
    const tStart = document.createTextNode("START WORKER");
    this.btnStart.appendChild(tStart);

    this.input = document.createElement("INPUT");
    this.input.value = 1000;
    document.body.appendChild(this.btnStart);
    document.body.appendChild(this.input);
  }

  createSample(length) {
    return Array(length).fill().map(() => Math.round(Math.random() * length));
  }

  async spawnWorker(sample) {
    const workerInstance = new Worker();
    const insertionSortClass = Comlink.proxy(workerInstance);
    const sortInstance = this.sortInstance = await new insertionSortClass();
    return await sortInstance.sort(sample);
  }

  initialSort(sample) {
    return Rx.Observable.defer(this.spawnWorker.bind(this, sample));
  }

  streamOfRandomNumbers(sampleSize = 100000, delay = 1000) {
    return Rx.Observable.interval(delay)
      .map((val) => Math.round(Math.random() * sampleSize))
  }

  sort(sample, timer) {
    const initialSortT0 = performance.now();
    let initialSort$ = this.initialSort(sample).do((data) => {
      const initialSortT1 = performance.now();
      console.log(data);
      console.log(`SORTING COMPLETED - TIME TAKEN: ${initialSortT1 - initialSortT0} milliseconds.`);
      console.log('-------------------------------------------------------------------------------');
    });
    let sorted$ = new Rx.BehaviorSubject(null);
    let streamOfRandomNumbers$ = this.streamOfRandomNumbers(sample.length, timer);

    return initialSort$.combineLatest(sorted$, (initialSortedArray, updatedSortedArray) => {
      if (updatedSortedArray != null) return updatedSortedArray;
      return initialSortedArray;
    })
    .zip(streamOfRandomNumbers$, (sortedArr, randomNumber) => {
      console.log(`ADDING RANDOM NUMBER TO ARRAY: ${randomNumber}`);
      const partialSortedArr = [randomNumber, ...sortedArr];
      const runningSorter = async (array) => {
        const runningSortT0 = performance.now();
        const runningSort =  await this.sortInstance.runningSort(array);
        const runningSortT1 = performance.now();
        console.log(runningSort);
        console.log(`SUCCESSIVE SORTING COMPLETED - TIME TAKEN: ${runningSortT1 - runningSortT0} milliseconds.`);
        console.log('-----------------------------------------------------------------------------------------');
        return runningSort;
      };
      return Rx.Observable.defer(runningSorter.bind(this, partialSortedArr));
    })
    .flatMap(runningSort$ => runningSort$)
    .do((_sortedArray) => {
      sorted$.next(_sortedArray)
    });
  }
}

const app = new App();
import * as Comlink from 'comlinkjs';

class insertionSort {
  constructor() {
    this.resetSort();
    this.pauseExecution = false;
    this.sample = this.createSample(100);
  }

  createSample(length) {
    return Array(length).fill().map(() => Math.round(Math.random() * length));
  }

  resetSort() {
    this.state = {
      i: 1,
      j: null,
      value: null,
    };
  }

  pauseSort() {
    this.pauseExecution = true;
    return 'sort paused';
  }

  addToSort(number) {
    this.sample.push(number);
    return {
      message: 'Added to sample'
    }
  }


  nonBlockingLoop(n, callback) {
    const loop = () => {
      if (this.state.i < n) {
        this.sortInternal();
        if (this.pauseExecution) {
          callback(this.state.i, false);
          return true;
        }
        this.state.i++;
        (self.requestAnimationFrame || self.setTimeout)(loop);
      }
      else {
        callback(this.state.i, true);
      }
    };

    loop();
  }

  sortInternal() {
    this.state.value = this.sample[this.state.i];
    this.state.j = this.state.i - 1;

    while(this.state.j >= 0 && this.sample[this.state.j] > this.state.value) {
      this.sample[this.state.j + 1] = this.sample[this.state.j];
      this.state.j = this.state.j - 1;
    }

    this.sample[this.state.j + 1] = this.state.value;
  }

  sort(callback) {
    this.pauseExecution = false;
    this.nonBlockingLoop(this.sample.length, (currentI, done) => {
      if (done) {
        callback({ message: 'Array Sorted', payload: this.sample });
      } else {
        callback({ message: 'Sorting paused', payload: this.sample });
      }
    });
  }

}
Comlink.expose(insertionSort, self);
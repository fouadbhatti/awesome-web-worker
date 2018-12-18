import * as Comlink from 'comlinkjs';

class insertionSort {
  sort(array) {
    for(let i = 1; i < array.length; i++){
      let value = array[i];
      let j = i - 1;
      while(j >= 0 && array[j] > value){
        array[j + 1] = array[j];
        j = j - 1;
      }
      array[j + 1] = value;
    }
    return array;
  }

  runningSort(array) {
    let i = 0;
    while(i < array.length && array[i] > array[i + 1]) {
      let value = array[i];
      array[i] = array[i + 1];
      array[i + 1] = value;
      i++;
    }
    return array;
  }
}
Comlink.expose(insertionSort, self);
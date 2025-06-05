// import React, { useState, useEffect } from 'react';
// import './App.css';

// const generateRandomArray = (len = 10) => {
//   return Array.from({ length: len }, () => Math.floor(Math.random() * 100));
// };

// const ALGORITHMS = {
//   'Bubble Sort': 'bubble',
//   'Selection Sort': 'selection',
//   'Insertion Sort': 'insertion',
// };

// const JAVA_CODES = {
//   bubble: `public static void bubbleSort(int[] arr) {
//     for (int i = 0; i < arr.length; i++) {
//       for (int j = 0; j < arr.length - i - 1; j++) {
//         if (arr[j] > arr[j + 1]) {
//           int temp = arr[j];
//           arr[j] = arr[j + 1];
//           arr[j + 1] = temp;
//         }
//       }
//     }
//   }`,
//   selection: `public static void selectionSort(int[] arr) {
//     for (int i = 0; i < arr.length - 1; i++) {
//       int minIdx = i;
//       for (int j = i + 1; j < arr.length; j++) {
//         if (arr[j] < arr[minIdx]) {
//           minIdx = j;
//         }
//       }
//       int temp = arr[minIdx];
//       arr[minIdx] = arr[i];
//       arr[i] = temp;
//     }
//   }`,
//   insertion: `public static void insertionSort(int[] arr) {
//     for (int i = 1; i < arr.length; i++) {
//       int key = arr[i];
//       int j = i - 1;
//       while (j >= 0 && arr[j] > key) {
//         arr[j + 1] = arr[j];
//         j = j - 1;
//       }
//       arr[j + 1] = key;
//     }
//   }`,
// };

// function App() {
//   const [array, setArray] = useState(generateRandomArray());
//   const [steps, setSteps] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [speed, setSpeed] = useState(500); // ms
//   const [comparisons, setComparisons] = useState(0);
//   const [algorithm, setAlgorithm] = useState('bubble');

//   const reset = () => {
//     setArray(generateRandomArray());
//     setSteps([]);
//     setCurrentStep(0);
//     setIsPlaying(false);
//     setComparisons(0);
//   };

//   const generateSteps = (arr, algo) => {
//     const steps = [];
//     const array = [...arr];
//     let compCount = 0;

//     if (algo === 'bubble') {
//       for (let i = 0; i < array.length; i++) {
//         for (let j = 0; j < array.length - i - 1; j++) {
//           steps.push({
//             array: [...array],
//             comparing: [j, j + 1],
//             message: `Comparing ${array[j]} and ${array[j + 1]}`,
//           });
//           compCount++;
//           if (array[j] > array[j + 1]) {
//             [array[j], array[j + 1]] = [array[j + 1], array[j]];
//             steps.push({
//               array: [...array],
//               swapped: [j, j + 1],
//               message: `Swapped ${array[j]} and ${array[j + 1]}`,
//             });
//           }
//         }
//       }
//     } else if (algo === 'selection') {
//       for (let i = 0; i < array.length - 1; i++) {
//         let minIdx = i;
//         for (let j = i + 1; j < array.length; j++) {
//           steps.push({
//             array: [...array],
//             comparing: [minIdx, j],
//             message: `Comparing ${array[minIdx]} and ${array[j]}`,
//           });
//           compCount++;
//           if (array[j] < array[minIdx]) {
//             minIdx = j;
//           }
//         }
//         if (minIdx !== i) {
//           [array[i], array[minIdx]] = [array[minIdx], array[i]];
//           steps.push({
//             array: [...array],
//             swapped: [i, minIdx],
//             message: `Swapped ${array[i]} and ${array[minIdx]}`,
//           });
//         }
//       }
//     } else if (algo === 'insertion') {
//       for (let i = 1; i < array.length; i++) {
//         let key = array[i];
//         let j = i - 1;
//         steps.push({
//           array: [...array],
//           comparing: [j, i],
//           message: `Comparing ${array[j]} and ${key}`,
//         });
//         compCount++;
//         while (j >= 0 && array[j] > key) {
//           array[j + 1] = array[j];
//           steps.push({
//             array: [...array],
//             swapped: [j, j + 1],
//             message: `Moved ${array[j]} to position ${j + 1}`,
//           });
//           j = j - 1;
//           if (j >= 0) {
//             steps.push({
//               array: [...array],
//               comparing: [j, i],
//               message: `Comparing ${array[j]} and ${key}`,
//             });
//             compCount++;
//           }
//         }
//         array[j + 1] = key;
//         steps.push({
//           array: [...array],
//           swapped: [j + 1],
//           message: `Inserted ${key} at position ${j + 1}`,
//         });
//       }
//     }

//     setSteps(steps);
//     setComparisons(compCount);
//     setCurrentStep(0);
//   };

//   useEffect(() => {
//     let timer;
//     if (isPlaying && currentStep < steps.length - 1) {
//       timer = setTimeout(() => setCurrentStep((prev) => prev + 1), speed);
//     } else {
//       setIsPlaying(false);
//     }
//     return () => clearTimeout(timer);
//   }, [isPlaying, currentStep, steps.length, speed]);

//   const visualArray = steps.length > 0 ? steps[currentStep].array : array;
//   const comparing =
//     steps.length > 0 && steps[currentStep].comparing
//       ? steps[currentStep].comparing
//       : [];
//   const swapped =
//     steps.length > 0 && steps[currentStep].swapped
//       ? steps[currentStep].swapped
//       : [];
//   const instruction =
//     steps.length > 0 ? steps[currentStep].message : 'Press Start to Begin Sorting';

//   return (
//     <div className="App">
//       <h1>Sorting Algorithm Visualization</h1>
//       <div className="container">
//         <div className="visualization">
//           {visualArray.map((val, idx) => (
//             <div
//               key={idx}
//               className={`bar ${
//                 comparing.includes(idx) ? 'comparing' : ''
//               } ${swapped.includes(idx) ? 'swapped' : ''}`}
//               style={{ height: `${val * 3}px` }}
//             >
//               {val}
//             </div>
//           ))}

//           <div className="instruction">{instruction}</div>

//           {steps.length > 0 && (
//             <input
//               type="range"
//               className="slider"
//               min="0"
//               max={steps.length - 1}
//               value={currentStep}
//               onChange={(e) => setCurrentStep(Number(e.target.value))}
//             />
//           )}
//         </div>

//         <div className="info-panel">
//           <h3>Algorithm Selection</h3>
//           <select
//             value={algorithm}
//             onChange={(e) => setAlgorithm(e.target.value)}
//             disabled={isPlaying}
//           >
//             {Object.entries(ALGORITHMS).map(([name, value]) => (
//               <option key={value} value={value}>
//                 {name}
//               </option>
//             ))}
//           </select>

//           <h3>{Object.keys(ALGORITHMS).find((key) => ALGORITHMS[key] === algorithm)} Code (Java)</h3>
//           <pre>{JAVA_CODES[algorithm]}</pre>

//           <p>
//             <strong>Step:</strong> {steps.length > 0 ? currentStep + 1 : 0} / {steps.length}
//           </p>
//           <p>
//             <strong>Total Comparisons:</strong> {comparisons}
//           </p>

//           <div style={{ marginTop: '10px' }}>
//             <button
//               onClick={() => {
//                 setIsPlaying(!isPlaying);
//               }}
//               disabled={steps.length === 0}
//             >
//               {isPlaying ? 'Pause' : 'Play'}
//             </button>
//             <button
//               onClick={() => generateSteps(array, algorithm)}
//               disabled={isPlaying}
//             >
//               Start Sorting
//             </button>
//             <button onClick={reset} disabled={isPlaying}>
//               Reset Array
//             </button>
//           </div>

//           <div style={{ marginTop: '10px' }}>
//             <label>Speed: </label>
//             <input
//               type="range"
//               min="100"
//               max="2000"
//               step="100"
//               value={speed}
//               onChange={(e) => setSpeed(Number(e.target.value))}
//             />
 
//             <span> {speed} ms</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';

const generateRandomArray = (len = 10) =>
  Array.from({ length: len }, () => Math.floor(Math.random() * 100));

const ALGORITHMS = {
  'Bubble Sort': 'bubble',
  'Selection Sort': 'selection',
  'Insertion Sort': 'insertion',
};

const JAVA_CODES = {
  bubble: `public static void bubbleSort(int[] arr) {
  for (int i = 0; i < arr.length; i++) {
    for (int j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`,
  selection: `public static void selectionSort(int[] arr) {
  for (int i = 0; i < arr.length - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    int temp = arr[minIdx];
    arr[minIdx] = arr[i];
    arr[i] = temp;
  }
}`,
  insertion: `public static void insertionSort(int[] arr) {
  for (int i = 1; i < arr.length; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}`,
};

function App() {
  const [array, setArray] = useState(generateRandomArray());
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [comparisons, setComparisons] = useState(0);
  const [algorithm, setAlgorithm] = useState('bubble');

  const reset = () => {
    setArray(generateRandomArray());
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setComparisons(0);
  };

  const generateSteps = (arr, algo) => {
    const steps = [];
    const array = [...arr];
    let compCount = 0;

    if (algo === 'bubble') {
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          steps.push({
            array: [...array],
            comparing: [j, j + 1],
            message: `Comparing ${array[j]} and ${array[j + 1]}`,
          });
          compCount++;
          if (array[j] > array[j + 1]) {
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
            steps.push({
              array: [...array],
              swapped: [j, j + 1],
              message: `Swapped ${array[j]} and ${array[j + 1]}`,
            });
          }
        }
      }
    } else if (algo === 'selection') {
      for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length; j++) {
          steps.push({
            array: [...array],
            comparing: [minIdx, j],
            message: `Comparing ${array[minIdx]} and ${array[j]}`,
          });
          compCount++;
          if (array[j] < array[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          [array[i], array[minIdx]] = [array[minIdx], array[i]];
          steps.push({
            array: [...array],
            swapped: [i, minIdx],
            message: `Swapped ${array[i]} and ${array[minIdx]}`,
          });
        }
      }
    } else if (algo === 'insertion') {
      for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        steps.push({
          array: [...array],
          comparing: [j, i],
          message: `Comparing ${array[j]} and ${key}`,
        });
        compCount++;
        while (j >= 0 && array[j] > key) {
          array[j + 1] = array[j];
          steps.push({
            array: [...array],
            swapped: [j, j + 1],
            message: `Moved ${array[j]} to position ${j + 1}`,
          });
          j = j - 1;
          if (j >= 0) {
            steps.push({
              array: [...array],
              comparing: [j, i],
              message: `Comparing ${array[j]} and ${key}`,
            });
            compCount++;
          }
        }
        array[j + 1] = key;
        steps.push({
          array: [...array],
          swapped: [j + 1],
          message: `Inserted ${key} at position ${j + 1}`,
        });
      }
    }

    setSteps(steps);
    setComparisons(compCount);
    setCurrentStep(0);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep((prev) => prev + 1), speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  const visualArray = steps.length > 0 ? steps[currentStep].array : array;
  const comparing = steps[currentStep]?.comparing || [];
  const swapped = steps[currentStep]?.swapped || [];
  const instruction = steps[currentStep]?.message || 'Press Start to Begin Sorting';

  return (
    <div className="App">
      <h1>Sorting Algorithm Visualization</h1>
      <div className="container">
        <div className="visualization">
          {visualArray.map((val, idx) => {
            const isComparing = comparing.includes(idx);
            const isSwapped = swapped.includes(idx);
            return (
              <div
                key={idx}
                className={`bar ${isSwapped ? 'swapped' : isComparing ? 'comparing' : ''}`}
                style={{ height: `${val * 3}px` }}
              >
                {val}
              </div>
            );
          })}
        </div>

        <div className="info-panel">
          <h3>Algorithm Selection</h3>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isPlaying}
          >
            {Object.entries(ALGORITHMS).map(([name, value]) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>

          <h3>{Object.keys(ALGORITHMS).find((key) => ALGORITHMS[key] === algorithm)} Code (Java)</h3>
          <pre>{JAVA_CODES[algorithm]}</pre>

          <p><strong>Step:</strong> {steps.length > 0 ? currentStep + 1 : 0} / {steps.length}</p>
          <p><strong>Total Comparisons:</strong> {comparisons}</p>

          <button onClick={() => setIsPlaying(!isPlaying)} disabled={steps.length === 0}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={() => generateSteps(array, algorithm)} disabled={isPlaying}>
            Start Sorting
          </button>
          <button onClick={reset} disabled={isPlaying}>
            Reset Array
          </button>

          <div style={{ marginTop: '10px' }}>
            <label>Speed: </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <span> {speed} ms</span>
          </div>
        </div>
      </div>

      <div className="instruction">{instruction}</div>

      {steps.length > 0 && (
        <input
          type="range"
          className="slider"
          min="0"
          max={steps.length - 1}
          value={currentStep}
          onChange={(e) => setCurrentStep(Number(e.target.value))}
        />
      )}
    </div>
  );
}

export default App;

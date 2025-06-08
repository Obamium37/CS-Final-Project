import React, { useState, useEffect } from 'react';
import {
  Grommet,
  Box,
  Heading,
  Button,
  Select,
  RangeInput,
  Text,
} from 'grommet';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const theme = {
  global: {
    font: {
      family: 'Arial, sans-serif',
    },
  },
};

const generateRandomArray = (len = 10) =>
  Array.from({ length: len }, () => Math.floor(Math.random() * 100));

const ALGORITHMS = {
  'Bubble Sort': 'bubble',
  'Selection Sort': 'selection',
  'Insertion Sort': 'insertion',
};

const JAVA_CODES = {
  bubble: {
    code: `public static void bubbleSort(int[] arr) {
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
    stepsToLine: (step) => {
      if (step.swapped) return 6;
      if (step.comparing) return 5;
      return 4;
    },
  },
  selection: {
    code: `public static void selectionSort(int[] arr) {
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
    stepsToLine: (step) => {
      if (step.swapped) return 10;
      if (step.comparing) return 5;
      return 4;
    },
  },
  insertion: {
    code: `public static void insertionSort(int[] arr) {
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
    stepsToLine: (step) => {
      if (step.swapped) return 6;
      if (step.comparing) return 5;
      return 4;
    },
  },
};

function App() {
  const [array, setArray] = useState(generateRandomArray());
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [comparisons, setComparisons] = useState(0);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [highlightLine, setHighlightLine] = useState(null);

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
          steps.push({ array: [...array], comparing: [j, j + 1], message: `Comparing ${array[j]} and ${array[j + 1]}` });
          compCount++;
          if (array[j] > array[j + 1]) {
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
            steps.push({ array: [...array], swapped: [j, j + 1], message: `Swapped ${array[j]} and ${array[j + 1]}` });
          }
        }
      }
    } else if (algo === 'selection') {
      for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length; j++) {
          steps.push({ array: [...array], comparing: [minIdx, j], message: `Comparing ${array[minIdx]} and ${array[j]}` });
          compCount++;
          if (array[j] < array[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          [array[i], array[minIdx]] = [array[minIdx], array[i]];
          steps.push({ array: [...array], swapped: [i, minIdx], message: `Swapped ${array[i]} and ${array[minIdx]}` });
        }
      }
    } else if (algo === 'insertion') {
      for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        steps.push({ array: [...array], comparing: [j, i], message: `Comparing ${array[j]} and ${key}` });
        compCount++;
        while (j >= 0 && array[j] > key) {
          array[j + 1] = array[j];
          steps.push({ array: [...array], swapped: [j, j + 1], message: `Moved ${array[j]} to position ${j + 1}` });
          j = j - 1;
          if (j >= 0) {
            steps.push({ array: [...array], comparing: [j, i], message: `Comparing ${array[j]} and ${key}` });
            compCount++;
          }
        }
        array[j + 1] = key;
        steps.push({ array: [...array], swapped: [j + 1], message: `Inserted ${key} at position ${j + 1}` });
      }
    }

    setSteps(steps);
    setComparisons(compCount);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (steps.length > 0) {
      const lineMapper = JAVA_CODES[algorithm].stepsToLine;
      const line = lineMapper(steps[currentStep]);
      setHighlightLine(line);
    }
  }, [currentStep, algorithm, steps]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep((s) => s + 1), speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  const visualArray = steps.length ? steps[currentStep].array : array;
  const comparing = steps[currentStep]?.comparing || [];
  const swapped = steps[currentStep]?.swapped || [];
  const instruction = steps[currentStep]?.message || 'Press "Start Sorting" to begin';

  return (
    <Grommet theme={theme} full>
      <Box pad="medium" gap="medium" align="center">
        <Heading level={2}>Sorting Algorithm Visualization</Heading>

        <Box direction="row-responsive" gap="large" width="xlarge" align="start">
          <Box
            flex
            background="light-2"
            round="small"
            pad="small"
            height="medium"
            width="large"
            overflow="auto"
            border={{ color: 'light-4', size: 'small' }}
          >
            <Box direction="row" gap="small" align="end" height="100%">
              {visualArray.map((v, i) => {
                const color = swapped.includes(i)
                  ? 'status-ok'
                  : comparing.includes(i)
                  ? 'status-warning'
                  : 'brand';

                return (
                  <Box
                    key={i}
                    width="small"
                    height={{ min: 'xxsmall', max: '100%' }}
                    align="center"
                    justify="end"
                  >
                    <Box
                      background={color}
                      width="xsmall"
                      height={`${Math.min(v * 1.8, 100)}%`}
                      round={{ corner: 'top', size: 'xsmall' }}
                      align="center"
                      justify="end"
                      pad="xxsmall"
                      style={{ transition: 'height 0.4s ease, background-color 0.3s ease' }}
                    >
                      <Text size="xsmall" color="white">
                        {v}
                      </Text>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box width="medium" gap="small">
            <Text weight="bold">Algorithm</Text>
            <Select
              options={Object.entries(ALGORITHMS).map(([k, v]) => ({ label: k, value: v }))}
              value={{
                label: Object.keys(ALGORITHMS).find((k) => ALGORITHMS[k] === algorithm),
                value: algorithm,
              }}
              onChange={({ option }) => setAlgorithm(option.value)}
              disabled={isPlaying}
            />

            <Text weight="bold">Code (Java)</Text>
            <Box width="large">
              <SyntaxHighlighter
                language="java"
                style={materialLight}
                wrapLines={true}
                showLineNumbers={true}
                lineProps={(lineNumber) =>
                  lineNumber === highlightLine
                    ? { style: { backgroundColor: '#ffeaa7', display: 'block' } }
                    : { style: { display: 'block' } }
                }
                customStyle={{
                  fontSize: '0.85rem',
                  maxHeight: '400px',
                  overflow: 'auto',
                  borderRadius: '6px',
                }}
              >
                {JAVA_CODES[algorithm].code}
              </SyntaxHighlighter>
            </Box>

            <Box direction="row" justify="between">
              <Text>Step: {steps.length ? currentStep + 1 : 0} / {steps.length}</Text>
              <Text>Comparisons: {comparisons}</Text>
            </Box>

            <Box direction="row" gap="small">
              <Button
                label={isPlaying ? 'Pause' : 'Play'}
                onClick={() => setIsPlaying((p) => !p)}
                disabled={!steps.length}
                primary
              />
              <Button
                label="Start Sorting"
                onClick={() => generateSteps(array, algorithm)}
                disabled={isPlaying}
              />
              <Button label="Reset" onClick={reset} disabled={isPlaying} />
            </Box>

            <Text>Speed: {speed} ms</Text>
            <RangeInput
              min={100}
              max={3000}
              step={100}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </Box>
        </Box>

        <Box width="xlarge" align="center" pad={{ top: 'small' }}>
          <Text align="center" size="large" color="dark-3" margin="small">
            {instruction}
          </Text>
          {steps.length > 0 && (
            <RangeInput
              min={0}
              max={steps.length - 1}
              value={currentStep}
              onChange={(e) => setCurrentStep(Number(e.target.value))}
            />
          )}
        </Box>
      </Box>
    </Grommet>
  );
}

export default App;

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
import { Sun, Moon } from 'grommet-icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight, materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const [themeMode, setThemeMode] = useState('light');

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
          const a = array[j], b = array[j + 1];
          steps.push({
            array: [...array],
            comparing: [j, j + 1],
            explanation: `Comparing elements at index ${j} (${a}) and ${j + 1} (${b}).`
          });
          compCount++;
          if (a > b) {
            [array[j], array[j + 1]] = [b, a];
            steps.push({
              array: [...array],
              swapped: [j, j + 1],
              explanation: `Swapped elements ${a} and ${b} at indices ${j} and ${j + 1}.`
            });
          }
        }
      }
    } else if (algo === 'selection') {
      for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length; j++) {
          const a = array[minIdx], b = array[j];
          steps.push({
            array: [...array],
            comparing: [minIdx, j],
            explanation: `Comparing current minimum ${a} (index ${minIdx}) with ${b} (index ${j}).`
          });
          compCount++;
          if (b < a) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          const a = array[i], b = array[minIdx];
          [array[i], array[minIdx]] = [b, a];
          steps.push({
            array: [...array],
            swapped: [i, minIdx],
            explanation: `Swapped new minimum ${b} with ${a} at index ${i}.`
          });
        }
      }
    } else if (algo === 'insertion') {
      for (let i = 1; i < array.length; i++) {
        const key = array[i];
        let j = i - 1;
        steps.push({
          array: [...array],
          comparing: [j, i],
          explanation: `Start inserting ${key} (index ${i}), compare with ${array[j]} at index ${j}.`
        });
        compCount++;
        while (j >= 0 && array[j] > key) {
          array[j + 1] = array[j];
          steps.push({
            array: [...array],
            swapped: [j, j + 1],
            explanation: `Shifted ${array[j]} from index ${j} to ${j + 1}.`
          });
          j--;
          if (j >= 0) {
            steps.push({
              array: [...array],
              comparing: [j, i],
              explanation: `Continue comparing ${array[j]} at index ${j} with key ${key}.`
            });
            compCount++;
          }
        }
        array[j + 1] = key;
        steps.push({
          array: [...array],
          swapped: [j + 1],
          explanation: `Inserted key ${key} at index ${j + 1}.`
        });
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
  const explanation = steps[currentStep]?.explanation || 'Press "Start Sorting" to begin.';

  return (
    <Grommet theme={theme} full themeMode={themeMode}>
      <Box pad="medium" gap="medium" align="center">
        <Heading level={2}>Sorting Algorithm Visualization</Heading>

        <Box direction="row" gap="small" align="center">
          <Text>Algorithm:</Text>
          <Select
            options={Object.entries(ALGORITHMS).map(([k, v]) => ({ label: k, value: v }))}
            value={{
              label: Object.keys(ALGORITHMS).find((k) => ALGORITHMS[k] === algorithm),
              value: algorithm,
            }}
            onChange={({ option }) => setAlgorithm(option.value)}
            disabled={isPlaying}
          />
          <Box direction="row" gap="small" align="center">
            <Button
              icon={themeMode === 'dark' ? <Sun /> : <Moon />}
              onClick={() => setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'))}
              tip={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
            />
          </Box>
        </Box>

        <Box direction="row-responsive" gap="large" width="xlarge" align="start">
          <Box
            flex
            background="light-2"
            round="small"
            pad="small"
            height={{ min: '400px', max: '500px' }}
            width="large"
            overflow="auto"
            border={{ color: 'light-4', size: 'small' }}
          >
            <Box direction="row" gap="small" align="end" height="100%">
              {visualArray.map((v, i) => {
                const isSwapped = swapped.includes(i);
                const isComparing = comparing.includes(i);
                const color = isSwapped
                  ? 'status-ok'
                  : isComparing
                  ? 'status-warning'
                  : 'brand';

                const labelColor = isSwapped
                  ? 'status-ok'
                  : isComparing
                  ? 'status-warning'
                  : 'dark-3';

                return (
                  <Box key={i} width="small" align="center" gap="xxsmall">
                    <Box
                      background={color}
                      width="xsmall"
                      height={`${Math.max(v * 4, 20)}px`}
                      round={{ corner: 'top', size: 'xsmall' }}
                      align="center"
                      justify="end"
                      pad="xxsmall"
                      style={{ transition: 'height 0.4s ease, background-color 0.3s ease' }}
                    >
                      <Text size="xsmall" color="white">{v}</Text>
                    </Box>
                    <Text size="xsmall" color={labelColor}>{i}</Text>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box width="medium" gap="small">
            <Text weight="bold">Code (Java)</Text>
            <Box width="xlarge">
              <SyntaxHighlighter
                language="java"
                style={themeMode === 'dark' ? materialDark : materialLight}
                wrapLines={true}
                showLineNumbers={true}
                lineProps={(lineNumber) => {
                  const isActive = lineNumber === highlightLine;
                  return {
                    style: {
                      backgroundColor: isActive
                        ? themeMode === 'dark'
                          ? '#264653' // Dark-mode friendly
                          : '#ffeaa7' // Light mode
                        : 'transparent',
                      display: 'block',
                    },
                  };
                }}
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

            <Box direction="row" gap="small" justify="center" wrap pad={{ vertical: 'small' }}>
              <Button label="Previous" onClick={() => setCurrentStep(s => Math.max(s - 1, 0))} disabled={isPlaying || currentStep <= 0} primary color="accent-2" />
              <Button label={isPlaying ? 'Pause' : 'Play'} onClick={() => setIsPlaying((p) => !p)} disabled={!steps.length} primary color="status-warning" />
              <Button label="Next" onClick={() => setCurrentStep(s => Math.min(s + 1, steps.length - 1))} disabled={isPlaying || currentStep >= steps.length - 1} primary color="accent-2" />
              <Button label="Start Sorting" onClick={() => generateSteps(array, algorithm)} disabled={isPlaying} primary color="status-ok" />
              <Button label="Reset" onClick={reset} disabled={isPlaying} primary color="status-critical" />
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
            💡 {explanation}
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

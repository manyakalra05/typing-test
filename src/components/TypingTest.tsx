import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/ThemeToggle';
import { RotateCcw, Zap, Timer, Target, TrendingUp } from 'lucide-react';

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice.",
  "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole filled with the ends of worms and an oozy smell.",
  "Space: the final frontier. These are the voyages of the starship Enterprise, exploring strange new worlds and civilizations.",
  "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness."
];

export const TypingTest = () => {
  const [currentText, setCurrentText] = useState(SAMPLE_TEXTS[0]);
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [canStart, setCanStart] = useState(true);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isStarted && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStarted, isCompleted]);

  const handleStartTest = () => {
    setCanStart(false);
    setIsStarted(true);
    setStartTime(Date.now());
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    setUserInput(value);
    setCurrentIndex(value.length);

    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== currentText[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    // Calculate accuracy
    const acc = value.length > 0 ? ((value.length - errorCount) / value.length) * 100 : 100;
    setAccuracy(Math.max(0, acc));

    // Calculate WPM
    if (startTime && timeElapsed > 0) {
      const wordsTyped = value.trim().split(' ').length;
      const minutes = timeElapsed / 60;
      setWpm(Math.round(wordsTyped / minutes));
    }

    // Check if completed
    if (value === currentText) {
      setIsCompleted(true);
      setEndTime(Date.now());
    }
  };

  const resetTest = () => {
    setUserInput('');
    setCurrentIndex(0);
    setIsStarted(false);
    setIsCompleted(false);
    setStartTime(null);
    setEndTime(null);
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setTimeElapsed(0);
    setCanStart(true);
    setCurrentText(SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]);
    inputRef.current?.focus();
  };

  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = 'transition-all duration-150 px-0.5 py-0.5 rounded ';
      
      if (index < currentIndex) {
        if (userInput[index] === char) {
          className += 'text-correct bg-green-500/20 text-green-600 dark:bg-green-500/10 dark:text-green-400';
        } else {
          className += 'text-incorrect bg-red-500/20 text-red-600 dark:bg-red-500/10 dark:text-red-400';
        }
      } else if (index === currentIndex) {
        className += 'text-current bg-primary text-primary-foreground animate-blink-cursor shadow-lg';
      } else {
        className += 'text-muted-foreground';
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const progress = (currentIndex / currentText.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 dark:from-background dark:via-muted/10 dark:to-card">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center pt-4">
          <div></div>
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold gradient-text typewriter drop-shadow-lg">
            KeyRush
          </h1>
          <p className="text-xl text-muted-foreground dark:text-muted-foreground/80">
            Test your typing speed and accuracy with style
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 card-enhanced neon-button hover:shadow-xl transition-all duration-300 border-l-4 border-l-secondary">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-secondary/20 rounded-full dark:bg-secondary/10">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">WPM</p>
                <p className="text-2xl font-bold text-secondary">{wpm}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-enhanced neon-button hover:shadow-xl transition-all duration-300 border-l-4 border-l-accent">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-accent/20 rounded-full dark:bg-accent/10">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold text-accent">{accuracy.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-enhanced neon-button hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/20 rounded-full dark:bg-primary/10">
                <Timer className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-2xl font-bold text-primary">{timeElapsed}s</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-enhanced neon-button hover:shadow-xl transition-all duration-300 border-l-4 border-l-destructive">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-destructive/20 rounded-full dark:bg-destructive/10">
                <TrendingUp className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-destructive">{errors}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 card-enhanced border-2 border-primary/20 dark:border-primary/10">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-foreground">Progress</span>
              <span className="text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </Card>

        {/* Main Typing Area */}
        <Card className="p-8 card-enhanced glow border-2 border-primary/30 dark:border-primary/20">
          <div className="space-y-6">
            <div className="relative">
              <div className="text-lg leading-relaxed font-mono p-6 typing-area bg-muted/30 dark:bg-muted/10 rounded-lg border-2 border-dashed border-primary/30 dark:border-primary/20 min-h-[200px] shadow-inner">
                {renderText()}
              </div>
            </div>

            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              disabled={isCompleted || !isStarted}
              placeholder={isStarted ? "" : "Click the play button to start..."}
              className="w-full h-32 p-4 text-lg font-mono bg-background/50 dark:bg-background/30 border-2 border-primary/30 dark:border-primary/20 rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 dark:focus:ring-secondary/30 transition-all duration-300 resize-none shadow-inner"
            />

            <div className="flex justify-center space-x-4">
              {canStart && !isStarted && (
                <button onClick={handleStartTest} className="play-button shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 36 36"
                    width="36px"
                    height="36px"
                  >
                    <rect width="36" height="36" x="0" y="0" fill="#fdd835"></rect>
                    <path
                      fill="#e53935"
                      d="M38.67,42H11.52C11.27,40.62,11,38.57,11,36c0-5,0-11,0-11s1.44-7.39,3.22-9.59 c1.67-2.06,2.76-3.48,6.78-4.41c3-0.7,7.13-0.23,9,1c2.15,1.42,3.37,6.67,3.81,11.29c1.49-0.3,5.21,0.2,5.5,1.28 C40.89,30.29,39.48,38.31,38.67,42z"
                    ></path>
                    <path
                      fill="#b71c1c"
                      d="M39.02,42H11.99c-0.22-2.67-0.48-7.05-0.49-12.72c0.83,4.18,1.63,9.59,6.98,9.79 c3.48,0.12,8.27,0.55,9.83-2.45c1.57-3,3.72-8.95,3.51-15.62c-0.19-5.84-1.75-8.2-2.13-8.7c0.59,0.66,3.74,4.49,4.01,11.7 c0.03,0.83,0.06,1.72,0.08,2.66c4.21-0.15,5.93,1.5,6.07,2.35C40.68,33.85,39.8,38.9,39.02,42z"
                    ></path>
                    <path
                      fill="#212121"
                      d="M35,27.17c0,3.67-0.28,11.2-0.42,14.83h-2C32.72,38.42,33,30.83,33,27.17 c0-5.54-1.46-12.65-3.55-14.02c-1.65-1.08-5.49-1.48-8.23-0.85c-3.62,0.83-4.57,1.99-6.14,3.92L15,16.32 c-1.31,1.6-2.59,6.92-3,8.96v10.8c0,2.58,0.28,4.61,0.54,5.92H10.5c-0.25-1.41-0.5-3.42-0.5-5.92l0.02-11.09 c0.15-0.77,1.55-7.63,3.43-9.94l0.08-0.09c1.65-2.03,2.96-3.63,7.25-4.61c3.28-0.76,7.67-0.25,9.77,1.13 C33.79,13.6,35,22.23,35,27.17z"
                    ></path>
                    <path
                      fill="#01579b"
                      d="M17.165,17.283c5.217-0.055,9.391,0.283,9,6.011c-0.391,5.728-8.478,5.533-9.391,5.337 c-0.913-0.196-7.826-0.043-7.696-5.337C9.209,18,13.645,17.32,17.165,17.283z"
                    ></path>
                    <path
                      fill="#212121"
                      d="M40.739,37.38c-0.28,1.99-0.69,3.53-1.22,4.62h-2.43c0.25-0.19,1.13-1.11,1.67-4.9 c0.57-4-0.23-11.79-0.93-12.78c-0.4-0.4-2.63-0.8-4.37-0.89l0.1-1.99c1.04,0.05,4.53,0.31,5.71,1.49 C40.689,24.36,41.289,33.53,40.739,37.38z"
                    ></path>
                    <path
                      fill="#81d4fa"
                      d="M10.154,20.201c0.261,2.059-0.196,3.351,2.543,3.546s8.076,1.022,9.402-0.554 c1.326-1.576,1.75-4.365-0.891-5.267C19.336,17.287,12.959,16.251,10.154,20.201z"
                    ></path>
                    <path
                      fill="#212121"
                      d="M17.615,29.677c-0.502,0-0.873-0.03-1.052-0.069c-0.086-0.019-0.236-0.035-0.434-0.06 c-5.344-0.679-8.053-2.784-8.052-6.255c0.001-2.698,1.17-7.238,8.986-7.32l0.181-0.002c3.444-0.038,6.414-0.068,8.272,1.818 c1.173,1.191,1.712,3,1.647,5.53c-0.044,1.688-0.785,3.147-2.144,4.217C22.785,29.296,19.388,29.677,17.615,29.677z M17.086,17.973 c-7.006,0.074-7.008,4.023-7.008,5.321c-0.001,3.109,3.598,3.926,6.305,4.27c0.273,0.035,0.48,0.063,0.601,0.089 c0.563,0.101,4.68,0.035,6.855-1.732c0.865-0.702,1.299-1.57,1.326-2.653c0.051-1.958-0.301-3.291-1.073-4.075 c-1.262-1.281-3.834-1.255-6.825-1.222L17.086,17.973z"
                    ></path>
                    <path
                      fill="#e1f5fe"
                      d="M15.078,19.043c1.957-0.326,5.122-0.529,4.435,1.304c-0.489,1.304-7.185,2.185-7.185,0.652 C12.328,19.467,15.078,19.043,15.078,19.043z"
                    ></path>
                  </svg>
                  <span className="now">now!</span>
                  <span className="play">play</span>
                </button>
              )}
              
              <Button
                onClick={resetTest}
                size="lg"
                className="neon-button bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary text-lg px-8 py-4 shadow-lg hover:shadow-xl dark:shadow-secondary/20"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                New Test
              </Button>
            </div>
          </div>
        </Card>

        {/* Completion Modal */}
        {isCompleted && (
          <Card className="p-8 card-enhanced border-2 border-secondary float shadow-2xl dark:shadow-secondary/20">
            <div className="text-center space-y-4">
              <div className="text-4xl animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold gradient-text">Test Completed!</h2>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-lg bg-secondary/10 dark:bg-secondary/5 border border-secondary/20">
                  <p className="text-2xl font-bold text-secondary">{wpm} WPM</p>
                  <p className="text-muted-foreground">Words per minute</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/10 dark:bg-accent/5 border border-accent/20">
                  <p className="text-2xl font-bold text-accent">{accuracy.toFixed(1)}%</p>
                  <p className="text-muted-foreground">Accuracy</p>
                </div>
              </div>
              <Button
                onClick={resetTest}
                size="lg"
                className="neon-button bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary shadow-lg hover:shadow-xl"
              >
                Try Again
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

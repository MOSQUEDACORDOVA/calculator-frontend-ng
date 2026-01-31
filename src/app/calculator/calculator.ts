import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Operation = '+' | '-' | '*' | '/' | null;

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calculator {
  protected readonly firstNumber = signal<string>('');
  protected readonly secondNumber = signal<string>('');
  protected readonly operation = signal<Operation>(null);
  protected readonly hasResult = signal(false);

  protected readonly result = computed(() => {
    const first = parseFloat(this.firstNumber());
    const second = parseFloat(this.secondNumber());
    const op = this.operation();

    if (isNaN(first) || isNaN(second) || !op) {
      return null;
    }

    switch (op) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '*':
        return first * second;
      case '/':
        return second !== 0 ? first / second : 'Error';
      default:
        return null;
    }
  });

  protected readonly operationSymbol = computed(() => {
    const op = this.operation();
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return '';
    }
  });

  protected onNumberClick(num: string): void {
    if (this.hasResult()) {
      this.clear();
    }

    if (!this.operation()) {
      this.firstNumber.update((current) => current + num);
    } else {
      this.secondNumber.update((current) => current + num);
    }
  }

  protected onDecimalClick(): void {
    if (this.hasResult()) {
      this.clear();
    }

    if (!this.operation()) {
      if (!this.firstNumber().includes('.')) {
        this.firstNumber.update((current) => (current || '0') + '.');
      }
    } else {
      if (!this.secondNumber().includes('.')) {
        this.secondNumber.update((current) => (current || '0') + '.');
      }
    }
  }

  protected onOperationClick(op: Operation): void {
    if (this.hasResult()) {
      this.hasResult.set(false);
    }

    if (this.firstNumber() && this.secondNumber() && this.operation()) {
      this.calculate();
    }

    if (this.firstNumber()) {
      this.operation.set(op);
    }
  }

  protected calculate(): void {
    if (this.firstNumber() && this.secondNumber() && this.operation()) {
      const resultValue = this.result();
      if (resultValue !== null && resultValue !== 'Error') {
        this.firstNumber.set(String(resultValue));
        this.secondNumber.set('');
        this.operation.set(null);
        this.hasResult.set(true);
      } else if (resultValue === 'Error') {
        this.hasResult.set(true);
      }
    }
  }

  protected clear(): void {
    this.firstNumber.set('');
    this.secondNumber.set('');
    this.operation.set(null);
    this.hasResult.set(false);
  }

  protected backspace(): void {
    if (this.hasResult()) {
      this.hasResult.set(false);
    }

    if (this.operation() && this.secondNumber()) {
      this.secondNumber.update((current) => current.slice(0, -1));
    } else if (this.operation() && !this.secondNumber()) {
      this.operation.set(null);
    } else if (this.firstNumber()) {
      this.firstNumber.update((current) => current.slice(0, -1));
    }
  }

  protected toggleSign(): void {
    if (!this.operation()) {
      if (this.firstNumber()) {
        this.firstNumber.update((current) =>
          current.startsWith('-') ? current.slice(1) : '-' + current
        );
      }
    } else {
      if (this.secondNumber()) {
        this.secondNumber.update((current) =>
          current.startsWith('-') ? current.slice(1) : '-' + current
        );
      }
    }
  }

  protected onPercentClick(): void {
    if (!this.operation()) {
      if (this.firstNumber()) {
        const value = parseFloat(this.firstNumber()) / 100;
        this.firstNumber.set(String(value));
      }
    } else {
      if (this.secondNumber()) {
        const value = parseFloat(this.secondNumber()) / 100;
        this.secondNumber.set(String(value));
      }
    }
  }
}

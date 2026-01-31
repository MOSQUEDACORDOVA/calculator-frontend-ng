import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

type Operation = '+' | '-' | '*' | '/' | null;

@Component({
  selector: 'app-calculator',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
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

  protected readonly displayExpression = computed(() => {
    const first = this.firstNumber() || '0';
    const op = this.operation() || '';
    const second = this.operation() ? (this.secondNumber() || '0') : '';
    return `${first} ${op} ${second}`.trim();
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

  protected clearEntry(): void {
    if (!this.operation()) {
      this.firstNumber.set('');
    } else if (!this.secondNumber()) {
      this.operation.set(null);
    } else {
      this.secondNumber.set('');
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
}

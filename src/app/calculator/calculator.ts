import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CalculatorService } from './calculator.service';
import { HistoryItem, Operator } from './calculator.models';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, MatListModule, MatProgressSpinnerModule],
})
export class Calculator implements OnInit {
  private readonly calculatorService = inject(CalculatorService);

  protected readonly firstNumber = signal<string>('');
  protected readonly secondNumber = signal<string>('');
  protected readonly operation = signal<Operator | null>(null);
  protected readonly hasResult = signal(false);
  protected readonly isHistoryOpen = signal(false);

  protected readonly history = this.calculatorService.history;
  protected readonly isLoading = this.calculatorService.isLoading;
  protected readonly error = this.calculatorService.error;
  protected readonly loadingTrigger = signal<'=' | Operator | null>(null);

  protected readonly displayValue = computed(() => {
    if (this.hasResult()) {
      return this.firstNumber();
    }
    const first = this.firstNumber() || '0';
    const op = this.operationSymbol();
    const second = this.operation() ? this.secondNumber() : '';
    return `${first}${op}${second}`;
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

  protected readonly displayFontSize = computed(() => {
    const length = this.displayValue().length;
    if (length <= 6) return 'text-7xl';
    if (length <= 9) return 'text-5xl';
    if (length <= 12) return 'text-4xl';
    if (length <= 15) return 'text-3xl';
    return 'text-2xl';
  });

  ngOnInit(): void {
    this.calculatorService.loadHistory();
  }

  private isValidNumber(value: string): boolean {
    if (!value || value === '-') return true;
    const num = parseFloat(value);
    return !isNaN(num) && Math.abs(num) <= 999.99;
  }

  private canAddDigit(current: string, digit: string): boolean {
    const newValue = current + digit;
    const isNegative = newValue.startsWith('-');
    const absValue = isNegative ? newValue.slice(1) : newValue;
    
    if (absValue.includes('.')) {
      const [intPart, decPart] = absValue.split('.');
      // Máximo 3 dígitos enteros y 2 decimales
      if (intPart.length > 3 || decPart.length > 2) return false;
    } else {
      // Máximo 3 dígitos enteros
      if (absValue.length > 3) return false;
    }
    
    return this.isValidNumber(newValue);
  }

  protected onNumberClick(num: string): void {
    if (this.hasResult()) {
      this.clear();
    }

    if (!this.operation()) {
      if (this.canAddDigit(this.firstNumber(), num)) {
        this.firstNumber.update((current) => current + num);
      }
    } else {
      if (this.canAddDigit(this.secondNumber(), num)) {
        this.secondNumber.update((current) => current + num);
      }
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

  protected onOperationClick(op: Operator): void {
    if (this.hasResult()) {
      this.hasResult.set(false);
    }

    if (this.firstNumber() && this.secondNumber() && this.operation()) {
      // Solo calcular si es el mismo operador, si es diferente solo cambiar el operador
      if (op === this.operation()) {
        this.calculateWithTrigger(op);
      }
    }

    if (this.firstNumber()) {
      this.operation.set(op);
    }
  }

  protected calculate(): void {
    this.calculateWithTrigger('=');
  }

  private calculateWithTrigger(trigger: '=' | Operator): void {
    const first = this.firstNumber();
    const second = this.secondNumber();
    const op = this.operation();

    if (first && second && op) {
      const num1 = parseFloat(first);
      const num2 = parseFloat(second);

      this.loadingTrigger.set(trigger);
      this.calculatorService.calculate(num1, op, num2).subscribe({
        next: (response) => {
          this.firstNumber.set(String(response.data.result));
          this.secondNumber.set('');
          this.operation.set(null);
          this.hasResult.set(true);
          this.loadingTrigger.set(null);
        },
        error: () => {
          // El error ya se maneja en el servicio
          this.hasResult.set(true);
          this.loadingTrigger.set(null);
        },
      });
    }
  }

  protected clear(): void {
    this.firstNumber.set('');
    this.secondNumber.set('');
    this.operation.set(null);
    this.hasResult.set(false);
    this.error.set(null);
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

  protected toggleHistory(): void {
    this.isHistoryOpen.update(open => !open);
  }

  protected closeHistory(): void {
    this.isHistoryOpen.set(false);
  }

  protected clearHistory(): void {
    this.calculatorService.clearHistory().subscribe();
  }

  protected useHistoryItem(item: HistoryItem): void {
    this.firstNumber.set(String(item.result));
    this.secondNumber.set('');
    this.operation.set(null);
    this.hasResult.set(true);
    this.closeHistory();
  }

  protected formatExpression(item: HistoryItem): string {
    return this.calculatorService.formatExpression(item);
  }
}

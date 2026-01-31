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

  ngOnInit(): void {
    this.calculatorService.loadHistory();
  }

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

  protected onOperationClick(op: Operator): void {
    if (this.hasResult()) {
      this.hasResult.set(false);
    }

    if (this.firstNumber() && this.secondNumber() && this.operation()) {
      this.calculateWithTrigger(op);
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

      // Validar límites de la API (-999.99 a 999.99)
      if (num1 < -999.99 || num1 > 999.99 || num2 < -999.99 || num2 > 999.99) {
        this.error.set('Los números deben estar entre -999.99 y 999.99');
        return;
      }

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

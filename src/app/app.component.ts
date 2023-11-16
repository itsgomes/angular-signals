import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div>
      <p>Counter is: {{counter()}}</p>
      <button type="button" (click)="increaseCounter()">Increase</button>
      <button type="button" (click)="decreaseCounter()">Decrease</button>
    </div>
    <hr>
    <div>
      <p>Counter computed is: {{counterComputed()}}</p>
    </div>
    <hr>
    <div>
      <p>Array is: {{arr() | json}}</p>
      <button type="button" (click)="increaseArray()">Increase</button>
      <button type="button" (click)="decreaseArray()">Decrease</button>
    </div>
    <hr>
    <div>
      <p>Object is: {{obj() | json}}</p>
      <button type="button" (click)="modifyObject()">Modify</button>
    </div>
    <hr>
    <div>
      <p>Object computed is: {{objComputed() | json}}</p>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public counter: WritableSignal<number> = signal(1);
  public counterComputed: Signal<number> = computed(() => this.counter() * 2);
  
  public arr: WritableSignal<number[]> = signal([1, 10, 20]);

  public obj: WritableSignal<{ name: string }[]> = signal(this.generateRandomArray());
  public objComputed: Signal<string[]> = computed(() => this.obj().map(a => a.name));

  public increaseCounter(): void {
    /*
    É possível adicionar um valor utilizando set, como também, o update. A diferença, é que o update concede o valor anterior.
    Exemplo:
    this.counter.update(valorAnterior = > valorAnterior + 1);
    */
    this.counter.set(this.counter() + 1);
  }

  public decreaseCounter(): void {
    this.counter.set(this.counter() - 1);
  }

  public increaseArray(): void {
    /*
    Sempre que é feito uma alteração no valor, essa alteração passa por uma validação chamada equal.
    Quando usamos um array/objeto, a validação sempre retornará falso.
    Por isso, é indicado o uso do mutate para fazer um bypass nesse método.
    */
    this.arr.mutate(v => v.push(this.generateRandomNumeric()));
  }

  public decreaseArray(): void {
    this.arr.mutate(v => v.pop());
  }

  public modifyObject(): void {
    this.obj.mutate((currentArray) => {
      if (currentArray.length > 0) {
        for (let item of currentArray)
          item.name = `Item ${this.generateRandomNumeric()}`
      }
    });
  }

  private generateRandomArray(items: number = 3): Array<{ name: string }> {
    return new Array(items).fill(null).map((_) => ({
      name: `Item ${this.generateRandomNumeric()}`,
    }));
  }

  private generateRandomNumeric(max: number = 100): number {
    return Math.floor(Math.random() * max);
  }

  /*
  Para implementar o effect você pode fazer por meio do construtor da classe, atribuindo a um campo ou passando um injector.
  Exemplo:

  constructor(private injector: Injector) {}
    
  initializeLogging(): void {
    effect(() => {
      console.log(`The count is: ${this.count()})`);
    }, {injector: this.injector});
  }

  Observação: Não é necessário destruir o effect, ele automaticamente destrói quando o contexto deixa de existir.
  */
  private logginEffect = effect(() => {
    console.log(`Array is ${this.arr()} and the counter is ${this.counter()}`);
  })
}

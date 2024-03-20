import { CurrencyPipe, getLocaleCurrencyCode } from '@angular/common';
import { Directive, ElementRef, HostListener, Inject, LOCALE_ID, Renderer2 } from '@angular/core';

@Directive({
  selector: '[currency]'
})

export class CustomCurrencyDirective {

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private element: ElementRef,
    private currencyPipe: CurrencyPipe,
    private renderer: Renderer2,
  ) { }

  @HostListener('focusin', ['$event']) focusInput() {
    this.inputChange();
  }

  @HostListener('input', ["$event.target.value"])
  inputChange() {
    const inputElement = this.element.nativeElement.getElementsByTagName('input')[0];
    if (inputElement) {
      const value = inputElement.value;
      this.renderValue(this.format(value || '0'));
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    this.renderValue(this.format(event.clipboardData.getData('text/plain')));
  }

  format(val: string) {
    console.log(val);
    let parsedValue = val.replace(/[\D]/g, '');
    let rawNumber = (parseFloat(`${parsedValue}`) / 100);

    return this.currencyPipe.transform(rawNumber, getLocaleCurrencyCode(this.locale));
  }

  renderValue(val: string) {
    this.renderer.setProperty(this.element.nativeElement, 'value', val);
  }
}

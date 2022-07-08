import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tooltipDescription'
})
export class TooltipDescriptionPipe implements PipeTransform {
  transform(value: string): string {
    let result = '';

      if (value && value.length > 0) {
        result = result.replaceAll('<br><br>', ' ');
        result = value.replaceAll('<br>', ' ');

        if (result.length > 100) {
          result = result.substring(0, 100) + '...';
        }
      }

      return result;
  }
}

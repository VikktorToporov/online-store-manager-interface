import { Component, Input, OnInit } from '@angular/core';
import { ItemCategory, ItemCategory_Display } from 'src/app/enums/item.enum';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input('user-id') userId: string;
}

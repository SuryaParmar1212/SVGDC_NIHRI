import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-principal-message',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './principal-message.component.html',
    styleUrl: './principal-message.css'
})
export class PrincipalMessageComponent { }

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, interval, Observable, Subscription, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-stop-watch',
  templateUrl: './stop-watch.component.html',
  styleUrls: ['./stop-watch.component.scss']
})
export class StopWatchComponent implements OnInit {
  timer$!: Subscription;
  @ViewChild('stopBtn', {static: true}) stopBtnRef!: ElementRef;
  stopClick$!: Observable<Event>;
  seconds = 0;
  minutes = 0;

  ngOnInit(): void {
    this.stopClick$ = fromEvent(this.stopBtnRef.nativeElement, 'click');
  }

  handleStartWatch(){
    this.timer$= interval(1000)
                 .pipe(takeUntil(this.stopClick$))
                 .subscribe(()=>{
                  this.seconds++;
                  if(this.seconds === 60){
                    this.minutes++;
                    this.seconds = 0;
                  }
                })
 }

  handleResetWatch(){
    this.timer$.unsubscribe();
    this.seconds = 0;
    this.minutes = 0;
  }
}

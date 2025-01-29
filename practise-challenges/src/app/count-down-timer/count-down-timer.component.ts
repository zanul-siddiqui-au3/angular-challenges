import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { fromEvent, interval, Observable, Subscription, takeUntil } from 'rxjs';


@Component({
  selector: 'app-count-down-timer',
  templateUrl: './count-down-timer.component.html',
  styleUrls: ['./count-down-timer.component.scss']
})
export class CountDownTimerComponent implements OnInit {
  counterForm = this.fb.group({
    hours: [0],
    minutes: [0],
    seconds: [0]
  })
  countDownSub$!: Subscription;
  @ViewChild('stopBtn', {static: true}) stopBtnRef!: ElementRef;
  stopBtn$!: Observable<Event>;
  counterStatus: 'start' | 'stop' | 'reset' | 'none' = 'none';

  constructor(private fb: FormBuilder){};

  ngOnInit(): void {
    this.stopBtn$ = fromEvent(this.stopBtnRef.nativeElement, 'click');
    this.stopBtn$.subscribe(()=>{
      this.counterStatus = 'stop';
      if(this.countDownSub$){
        this.countDownSub$.unsubscribe();
      }
    })
  }

  handleStartTimer(){
    if(this.countDownSub$){
      this.countDownSub$.unsubscribe();
    }
    this.counterStatus = 'start';
      this.countDownSub$ = interval(1000).pipe(takeUntil(this.stopBtn$)).subscribe(()=>{
        const {hours, minutes, seconds} = this.getTimeValues();
        if(hours === 0 && minutes === 0 && seconds === 0){
          this.countDownSub$.unsubscribe();
        }
        this.counterForm.patchValue({hours, minutes, seconds})
      })
  }

  getTimeValues(): {hours: number, minutes: number, seconds:number}{
    let totalSeconds = 
    (((this.counterForm.get('hours')?.value || 0) * 3600) + 
    ((this.counterForm.get('minutes')?.value || 0)* 60) + 
    ((this.counterForm.get('seconds')?.value || 0))) - 1;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    const seconds = Math.floor((totalSeconds - ((hours * 3600 )+ (minutes * 60))));

    return {hours, minutes, seconds}
  }

  handleReset() {
    this.counterStatus = 'reset';
    this.counterForm.patchValue({hours:0, minutes: 0, seconds: 0});
    if(this.countDownSub$){
      this.countDownSub$.unsubscribe();
    }
  }
}

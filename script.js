
var vuePanel = new Vue({
    el: '#panel',
    data: {
      showTODOLIST : true,
      showDASHBOARD : false,
      showPanel: false,
      tabIsRight: false,
      tabIsLeft: true,
      isSelected: '',
      activeDay : '',
      currentDay: '',
      currentDate: '',
      currentMonthe: '',
      currentYear: '',
      taskName:'',
      tomatoSum: [],
      weekTomatoSum: 0,
      historyData: []
    },
    mounted:function(){
      this.showPanel = true;
      var today = new Date();
      this.currentYear = today.getFullYear();
      this.currentMonth = today.getMonth()+1;
      this.currentDate = today.getDate();
      this.currentDay = today.getDay();
      this.activeDay =  this.currentDay;
      //get the date og the first day of this week
      var date = new Date();
      date.setDate(date.getDate() - this.currentDay); //get the date of Sunday of current week
      var startDay = date.getDate();
      var startMonth = date.getMonth()+1;
      backup = JSON.parse(localStorage.getItem('historyData'));
      if (backup != null && backup[0].date ==  startMonth +'/' + startDay){
        this.historyData = JSON.parse(JSON.stringify(backup));
      }
      else{
        for (var i = 0; i < 7; i++) {
          var tempMonth = date.getMonth()+1;
          var tempDate = date.getDate();
          this.historyData.push({date: tempMonth +'/' + tempDate, task: []});
          date.setDate(date.getDate() + 1);
        }
      }
      this.updateTomatoSum();
    },
    methods:{
      changeTab: function(pTarget){
        if (pTarget == "to_do_list"){
          this.showTODOLIST = true;
          this.showDASHBOARD = false;
          this.tabIsRight = false;
          this.tabIsLeft = true;

        }
        else{
          this.showTODOLIST = false;
          this.showDASHBOARD = true;
          this.tabIsRight = true;
          this.tabIsLeft = false;
        }
      },
      changeActiveDate: function(pDate){
        this.isSelected = '';
        this.activeDay = pDate;
        this.updateTomatoSum();
      },
      updateTomatoSum(){
        let weekSum = 0
        for(var i = 0; i < 7; i++){
          this.tomatoSum[i] = this.historyData[i].task.reduce(function(sum,element){
            if ("tomatoNum" in element){
              return sum + element.tomatoNum
            }
            else{
              return sum;
            }
          },0);
          weekSum += this.tomatoSum[i];
        }
        this.weekTomatoSum = weekSum;
      },
      addTask(){
        this.historyData[this.activeDay].task.push({taskName: this.taskName, complete: false, tomatoNum: 0});
        localStorage.setItem('historyData', JSON.stringify(this.historyData));
        this.taskName = '';
      },
      changeTaskStatus: function(pTaskName){
        var selectedIndex = this.historyData[this.activeDay].task.map(function(e) { return e.taskName; }).indexOf(pTaskName);
        if (this.historyData[this.activeDay].task[selectedIndex].complete == true){
          this.historyData[this.activeDay].task[selectedIndex].complete = false;
        }
        else{
          this.historyData[this.activeDay].task[selectedIndex].complete = true;
        }
        localStorage.setItem('historyData', JSON.stringify(this.historyData));
      }
    }

});

var vueClock = new Vue({
  el: '#clock',
  data:{
    showClock: false,
    targetMinutes: '15',
    countMinutes: '15',
    countSeconds: '00',
    isPlaying: false,
    alarm: 'notifications',
    timer: null,
  },
  mounted:function(){
    this.showClock = true;
  },
  methods:{
    changeAlarmStatus(){
      this.alarm == 'notifications'?this.alarm = 'notifications_off':this.alarm = 'notifications';
    },
    changeTargetMinutes: function(pTargetMinutes){
      this.targetMinutes = pTargetMinutes;
      this.countMinutes = pTargetMinutes;
      this.countSeconds = '00';
    },
    reset(){
      alert("reset");
      alert(this.targetMinutes);
      let target = this.targetMinutes;
      this.countMinutes = target;
      this.countSeconds = '00';
    },
    timeCountDown(){
      if (vuePanel.isSelected != ''){
        let my = this;
        this.isPlaying = true;
        this.timer = setInterval(function() {
          var m = Number(my.countMinutes);
          var s = Number(my.countSeconds);
          var snd = new Audio("https://www.freespecialeffects.co.uk/soundfx/various/forest.wav");
          if (m != 0 && s == 0){
            m--;
            s = 59;
            m < 10 ? my.countMinutes = '0' + m : my.countMinutes = '' + m;
            s < 10 ? my.countSeconds = '0' + s : my.countSeconds = '' + s;
          }
          else if (m == 0 && s==0){
            my.stopCounDown();
            if (this.alarm == 'notifications'){
              snd.play();
            }
            else{
              alert('Stop timing');
            }
            var selectedIndex = vuePanel.historyData[vuePanel.activeDay].task.map(function(e) { return e.taskName; }).indexOf(vuePanel.isSelected.taskName);
            vuePanel.historyData[vuePanel.activeDay].task[selectedIndex].tomatoNum += 1
            localStorage.setItem('historyData', JSON.stringify(vuePanel.historyData));
            vuePanel.updateTomatoSum();
            my.reset();
          }
          else{
            s--;
            m < 10 ? my.countMinutes = '0' + m : my.countMinutes = '' + m;
            s < 10 ? my.countSeconds = '0' + s : my.countSeconds = '' + s;
          }

        },1000);
      }
      else{
        alert('Please choose the task');
      }
    },
    stopCounDown(){
      clearInterval(this.timer);
      this.isPlaying = false;
    }
  }
})

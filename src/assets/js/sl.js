class Slider {
  constructor(element) {
    this.runDragFunc = this.calcDrag.bind(this)
    this.element = document.querySelector(element);
    this.area = this.element.querySelector('.slider-area');
    this.slides = this.area.querySelectorAll('.slider-slide');
    this.elementWidth = this.element.clientWidth;
    this.clientRect = this.element.getBoundingClientRect().left;
    this.startX;
    this.page = 1;
    this.maxPage = this.element.querySelectorAll('.slider-slide').length

    const areaWidth = this.elementWidth * this.maxPage;
    this.area.style.width = areaWidth+'px'


    this.element.addEventListener('mousedown', this.slideStart.bind(this));
    this.element.addEventListener('mouseup', this.onMouseUp.bind(this));

  };

  slideStart(e) {
    e.preventDefault()

    this.startX = e.offsetX;

    this.element.addEventListener('mousemove', this.runDragFunc)
  };
  
  calcDrag(e) {
    e.preventDefault()
    this.area.style.transition = ''

    var result = (this.page - 1) * -this.elementWidth
    var onDrag = e.clientX - this.clientRect - this.startX + result

    this.area.style.left = onDrag + 'px'
  };
  
  onMouseUp(e) {
    const pageTrigger = -200;
    e.preventDefault();
    this.element.removeEventListener('mousemove', this.runDragFunc);
    var onDrag = e.clientX - this.clientRect - this.startX;
    const areaLeft = this.area.style.left;
    
    if( this.page <= 1 && onDrag >= 0 ) {
      this.changePosition(0)
    }
    if( this.page >= this.maxPage && onDrag <= 0 ) {
      var result = (this.page - 1) * -this.elementWidth
      this.changePosition(result)
    }

    if(onDrag < pageTrigger) {
      if(this.page >= this.maxPage) return false
      this.page++
      var result = (this.page - 1) * -this.elementWidth
      this.changePosition(result)
    } else if(onDrag > -pageTrigger) {
      if(this.page <= 1) return false
      this.page--
      var result = (this.page - 1) * -this.elementWidth
      this.changePosition(result)
    } else {
      var result = (this.page - 1) * -this.elementWidth
      this.changePosition(result)
    }

    this.startX = 0
  };
  changePosition(d) {
    if(d == undefined) {
      this.area.style.left =  '0px'
    }
    this.area.style.transition = '.2s left'
    this.area.style.left = d + 'px'
  }
};


(function() {
  const slider = new Slider('.slider')
})();
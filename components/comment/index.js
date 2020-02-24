// components/comment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    allComment:{
      type:Array
    },
    isHideButton:{
        type:Boolean
    }
    
    
  
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready(){
    // console.log(this.data.isHideButton)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    Recomment(e){
      // console.log(e)
      this.triggerEvent('Recomment',{...e.target.dataset.item,isTure:true})
    }
  }
})

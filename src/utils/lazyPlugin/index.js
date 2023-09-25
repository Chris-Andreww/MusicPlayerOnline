import { useIntersectionObserver } from '@vueuse/core'

export const lazyPlugin = {
  install (app) {
    //去哪聚绑定图片懒加载，只有在图片进入视口时才加载url
    app.directive('img-lazy', {
      mounted (el, binding) {
        useIntersectionObserver(el, ([{ isIntersecting }]) => {
          if (isIntersecting) {
            //进入视口区域，isIntersecting就会为true，此时就给div的src属性添加url
            el.src = binding.value
          }
        })
      }
    })
  }
}
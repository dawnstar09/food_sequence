'use client'

import { useEffect } from 'react'

export default function DevToolsBlocker() {
  useEffect(() => {
    // F12 키 차단
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 키
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault()
        e.stopPropagation()
        alert('개발자 도구 사용이 제한되어 있습니다.')
        return false
      }
      
      // Ctrl + Shift + I (개발자 도구)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        e.stopPropagation()
        alert('개발자 도구 사용이 제한되어 있습니다.')
        return false
      }
      
      // Ctrl + Shift + J (콘솔)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        e.stopPropagation()
        alert('개발자 도구 사용이 제한되어 있습니다.')
        return false
      }
      
      // Ctrl + U (소스 보기)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        e.stopPropagation()
        alert('소스 보기가 제한되어 있습니다.')
        return false
      }

      // Ctrl + Shift + K (네트워크 탭)
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault()
        e.stopPropagation()
        alert('개발자 도구 사용이 제한되어 있습니다.')
        return false
      }

      // Ctrl + Shift + C (요소 검사)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        e.stopPropagation()
        alert('요소 검사가 제한되어 있습니다.')
        return false
      }
    }

    // 우클릭 메뉴 차단
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      alert('우클릭이 제한되어 있습니다.')
      return false
    }

    // 개발자 도구 열림 감지
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      
      if (widthThreshold || heightThreshold) {
        alert('개발자 도구를 닫아주세요.')
        // 페이지를 홈으로 이동
        window.location.href = '/'
      }
    }

    // 텍스트 선택 방지
    const handleSelectStart = (e: Event) => {
      e.preventDefault()
      return false
    }

    // 드래그 방지
    const handleDragStart = (e: Event) => {
      e.preventDefault()
      return false
    }

    // 이미지 저장 방지
    const handleImgContextMenu = (e: Event) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault()
        return false
      }
    }

    // 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('contextmenu', handleImgContextMenu)

    // 개발자 도구 감지 (정기적으로 체크)
    const devToolsInterval = setInterval(detectDevTools, 1000)

    // 콘솔에 경고 메시지
    console.clear()
    console.log('%c⚠️ 경고', 'color: red; font-size: 30px; font-weight: bold;')
    console.log('%c이 사이트는 보안이 적용되어 있습니다.', 'color: red; font-size: 16px;')
    console.log('%c개발자 도구 사용이 감지되면 접근이 차단됩니다.', 'color: red; font-size: 16px;')

    // CSS로 선택, 복사, 드래그 방지 스타일 추가
    const style = document.createElement('style')
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('contextmenu', handleImgContextMenu)
      clearInterval(devToolsInterval)
      document.head.removeChild(style)
    }
  }, [])

  return null // 렌더링할 UI 없음
}

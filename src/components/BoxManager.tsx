'use client'

import { useBoxContext, BoxStatus } from '@/contexts/BoxContext'

interface BoxManagerProps {
  onClose: () => void
}

export default function BoxManager({ onClose }: BoxManagerProps) {
  const { boxes, statuses, updateBox, resetAll } = useBoxContext()

  const changeStatus = (id: string, status: BoxStatus) => {
    updateBox(id, { status })
  }

  const getStatusClasses = (status: BoxStatus) => {
    const statusInfo = statuses[status]
    if (status === 'finished') {
      return 'bg-gray-300 border-gray-300 text-gray-600 opacity-70'
    }
    return `${statusInfo.bgColor} ${statusInfo.borderColor} ${statusInfo.color}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">박스 관리자</h2>
            <div className="space-x-2">
              <button
                onClick={resetAll}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                모두 초기화
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                닫기
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {boxes.map((box) => (
              <div key={box.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-center mb-4">
                  <div 
                    className={`rounded-lg p-4 mb-3 font-bold text-lg transition-all duration-200 border-2 ${
                      getStatusClasses(box.status)
                    }`}
                  >
                    {box.id}
                  </div>
                  <div className={`text-sm mb-2 font-medium ${
                    box.status === 'finished' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    상태: {statuses[box.status].label}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600 text-center">상태 변경</div>
                    <div className="grid grid-cols-1 gap-1">
                      {Object.entries(statuses).filter(([key]) => key !== 'finished').map(([statusKey, statusInfo]) => (
                        <button
                          key={statusKey}
                          onClick={() => changeStatus(box.id, statusKey as BoxStatus)}
                          className={`px-3 py-2 rounded text-sm font-medium transition-all duration-200 border ${
                            box.status === statusKey
                              ? `${statusInfo.bgColor} ${statusInfo.color} border-gray-700 ring-2 ring-blue-500`
                              : `bg-white hover:${statusInfo.bgColor} hover:${statusInfo.color} border-gray-300`
                          }`}
                        >
                          {statusInfo.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 출발 상태일 때만 배식 끝 버튼 표시 */}
                  {box.status === 'departure' && (
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => changeStatus(box.id, 'finished')}
                        className="w-full px-3 py-2 rounded text-sm font-medium transition-all duration-200 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
                      >
                        배식 끝
                      </button>
                    </div>
                  )}

                  {/* 배식 끝 상태일 때 다시 시작 버튼 */}
                  {box.status === 'finished' && (
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => changeStatus(box.id, 'waiting')}
                        className="w-full px-3 py-2 rounded text-sm font-medium transition-all duration-200 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300"
                      >
                        다시 시작
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

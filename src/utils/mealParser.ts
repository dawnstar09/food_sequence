export interface MealData {
  date: string
  menu: string[]
  calories: string
  nutrition: {
    carbs: string
    protein: string
    fat: string
    vitaminA: string
    vitaminC: string
    calcium: string
    iron: string
  }
  ingredients: string
  school?: string
}

export async function parseMealCSV(): Promise<MealData[]> {
  try {
    // 브라우저에서는 CSV 파일을 public 폴더에서 fetch
    const response = await fetch('/food_calender.csv')
    const csvText = await response.text()
    
    const lines = csvText.split('\n')
    const headers = lines[0].split(',')
    
    const meals: MealData[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const columns = parseCSVLine(line)
      if (columns.length < 13) continue
      
      const dateStr = columns[6] // 급식일자
      const menuStr = columns[8] // 요리명
      const caloriesStr = columns[10] // 칼로리정보
      const nutritionStr = columns[11] // 영양정보
      const ingredientsStr = columns[9] // 원산지정보
      const schoolName = columns[3] // 학교명
      
      // 메뉴 파싱 (HTML 태그 제거 및 분리)
      const menuItems = menuStr
        .replace(/<br\/?>/g, '|')
        .split('|')
        .map(item => item.replace(/\s*\([^)]*\)/g, '').trim())
        .filter(item => item.length > 0)
      
      // 영양정보 파싱
      const nutrition = parseNutrition(nutritionStr)
      
      // 원산지 정보 간소화
      const ingredients = ingredientsStr
        .split('<br/>')
        .slice(0, 3)
        .join(', ')
        .replace(/비고.*$/, '')
        .trim()
      
      // 날짜 포맷팅
      const formattedDate = formatDate(dateStr)
      
      meals.push({
        date: formattedDate,
        menu: menuItems,
        calories: caloriesStr,
        nutrition,
        ingredients,
        school: schoolName
      })
    }
    
    return meals
  } catch (error) {
    console.error('CSV 파싱 오류:', error)
    return []
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current)
  return result
}

function parseNutrition(nutritionStr: string) {
  const defaultNutrition = {
    carbs: '정보없음',
    protein: '정보없음', 
    fat: '정보없음',
    vitaminA: '정보없음',
    vitaminC: '정보없음',
    calcium: '정보없음',
    iron: '정보없음'
  }
  
  try {
    const parts = nutritionStr.split('<br/>')
    const nutrition: any = {}
    
    parts.forEach(part => {
      if (part.includes('탄수화물')) {
        nutrition.carbs = part.split(':')[1]?.trim() || defaultNutrition.carbs
      } else if (part.includes('단백질')) {
        nutrition.protein = part.split(':')[1]?.trim() || defaultNutrition.protein
      } else if (part.includes('지방')) {
        nutrition.fat = part.split(':')[1]?.trim() || defaultNutrition.fat
      } else if (part.includes('비타민A')) {
        nutrition.vitaminA = part.split(':')[1]?.trim() || defaultNutrition.vitaminA
      } else if (part.includes('비타민C')) {
        nutrition.vitaminC = part.split(':')[1]?.trim() || defaultNutrition.vitaminC
      } else if (part.includes('칼슘')) {
        nutrition.calcium = part.split(':')[1]?.trim() || defaultNutrition.calcium
      } else if (part.includes('철분')) {
        nutrition.iron = part.split(':')[1]?.trim() || defaultNutrition.iron
      }
    })
    
    return { ...defaultNutrition, ...nutrition }
  } catch (error) {
    return defaultNutrition
  }
}

function formatDate(dateStr: string): string {
  if (dateStr.length === 8) {
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    return `${year}-${month}-${day}`
  }
  return dateStr
}

// apiClient.ts 优化版本
import axios, { AxiosInstance } from 'axios'

// 类型声明增强
declare module 'axios' {
  interface AxiosRequestConfig {
    /**
     * 是否显示全局loading
     * @default true
     */
    showLoading?: boolean
  }
}

console.log(process.env)

const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://spark-api-open.xf-yun.com/v1',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Authorization': `Bearer MffHbNSvWxFaAcapjUHu:NfCrPfjPtolDCFTZljWk`,
  }
})

// 请求拦截器
apiClient.interceptors.request.use(config => {
  console.log(config)
  return config;
})

// 响应拦截器优化
apiClient.interceptors.response.use(
  response => {
    try {
      console.log(response)
      const content = response.data?.choices[0]?.message.content
      if (content) {
        console.log(content.replaceAll('```', '').replace('json', '').replace('\n', ''))
        return JSON.parse(content.replaceAll('```', '').replace('json', '').replace('\n', ''))
      }
      throw new Error('无效的响应结构')
    } catch (error) {
      console.error('响应解析失败:', error)
      throw new Error(`数据处理失败: ${error.message}`)
    }
  },
  error => {
    console.error('请求失败:', error.config.url, error.response?.status)
    return Promise.reject({
      code: error.response?.status || 'ECONNABORTED',
      message: error.response?.data?.message || '网络连接异常',
      original: error
    })
  }
)

// 生成星火大模型专用prompt
function generateSparkPrompt(instructions: string, data: any[]) {
  return {
    model: '4.0Ultra',
    messages: [
      {
        role: 'user',
        content: `根据以下要求处理报价数据：
              ${instructions}
              原始数据：${JSON.stringify(data)}
              请严格按以下格式返回JSON数据：
              1. 使用双引号包裹所有键和字符串值
              2. 不要包含任何注释
              3. 直接返回数组，不要包裹在Markdown中
              4. 确保数值不使用引号包裹
              5.确保包含adjustedPrice以及reason字段`
      }
    ],
    stream: false
  }
}

// API方法优化
export const aiService = {
  processQuotation: (payload: {
    originalData: any[]
    instructions: string
  }) => {
    return apiClient.post('/chat/completions',
      generateSparkPrompt(payload.instructions, payload.originalData),
      {
        showLoading: true
      }
    )
  }
}
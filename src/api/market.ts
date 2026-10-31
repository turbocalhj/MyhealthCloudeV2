// src/api/market.ts
import type { ComputingProduct } from '@/types'

/**
 * 真实业务中应使用标准 http 进行翻页或列表请求：
 * export function getMarketProducts(params: any) {
 *   return http.get('/market/products', { params })
 * }
 *
 * 当前阶段将 Mock 数据生成逻辑保留在 API 数据层。
 */
export function fetchMarketProducts(): Promise<ComputingProduct[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockList: ComputingProduct[] = []
      const gpuBrands = ['华为', '昆仑芯', '平头哥', '英伟达']
      const sourceMarkets = ['健康云', '电信', '移动', '联通', '华数', '阿里云']
      const subies = ['50%', '30%', '20%', '无补贴']
      const gpuCounts = ['8卡', '4卡', '2卡', '1卡']

      const gTypes: Record<string, string> = {
        '华为': 'Huawei Atlas 300',
        '昆仑芯': 'KUNLUNXIN GPU-R200',
        '平头哥': 'Hanguang 800',
        '英伟达': 'NVIDIA A100'
      }

      for (let i = 1; i <= 64; i++) {
        const brand = gpuBrands[i % gpuBrands.length]
        const isSelf = i % 5 === 0
        const sourceMarket = sourceMarkets[i % sourceMarkets.length]
        const subsidy = subies[i % subies.length]
        const gpuCountStr = gpuCounts[i % gpuCounts.length]

        const labels: string[] = []
        if (isSelf) labels.push('自营算力')
        else labels.push(sourceMarket)

        const cityRandom = i % 2 === 0 ? '杭州市' : (i % 3 === 0 ? '北京市' : '宁波市')
        labels.push(cityRandom.replace('市', '区'))
        labels.push('资源充足')
        if (subsidy !== '无补贴') labels.push(`算力补贴${subsidy}`)

        let price = 2000 + (i * 450)
        let priceUnit = '/月'
        if (i % 7 === 0) {
          price = 10 + (i % 3)
          priceUnit = '/时'
        }

        mockList.push({
          id: i,
          name: isSelf ? `自营大厂算力服务-${brand}${i * 10}` : `${sourceMarket}主机测试-${brand}`,
          marketTag: isSelf ? '自营算力' : '市场算力',
          labels,
          gpuType: gTypes[brand],
          gpuCount: gpuCountStr.replace('卡', ' 卡'),
          memory: `${16 * (i % 4 + i)} GB`,
          cpu: `${2 * i} 核`,
          ram: `${4 * i} GB`,
          disk: '50 GB',
          price,
          priceUnit,
          isOutOfStock: i % 9 === 0,
          metaSourceType: isSelf ? '自营' : '市场',
          metaSubSource: sourceMarket,
          metaProvince: cityRandom === '北京市' ? '北京市' : '浙江省',
          metaCity: cityRandom,
          metaGpuBrand: brand,
          metaGpuCount: gpuCountStr,
          metaSubsidy: subsidy
        })
      }
      resolve(mockList)
    }, 600)
  })
}

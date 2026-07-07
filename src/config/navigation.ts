import type { LucideIcon } from 'lucide-react'
import {
	Ticket,
	Compass,
	Layers,
	Footprints,
	Globe,
	Repeat,
	Package,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'codes', path: '/codes', icon: Ticket, isContentType: true },
	{ key: 'guide', path: '/guide', icon: Compass, isContentType: true },
	{ key: 'stages', path: '/stages', icon: Layers, isContentType: true },
	{ key: 'maze', path: '/maze', icon: Footprints, isContentType: true },
	{ key: 'worlds', path: '/worlds', icon: Globe, isContentType: true },
	{ key: 'rebirth', path: '/rebirth', icon: Repeat, isContentType: true },
	{ key: 'items', path: '/items', icon: Package, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['codes', 'guide', 'stages', 'maze', 'worlds', 'rebirth', 'items']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}

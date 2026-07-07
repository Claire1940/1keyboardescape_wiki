"use client";

import { Suspense, lazy } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  ExternalLink,
  Gift,
  Medal,
  RefreshCw,
  Route,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

// Tools Grid 卡片与首页模块 section 的 1:1 锚点映射
const TOOL_CARD_SECTION_IDS = [
  "codes",
  "beginner-guide",
  "speed-farming-guide",
  "rebirth-guide",
  "trails-auras",
  "treadmills",
  "stages",
  "free-rewards",
];

// Codes 模块 status 徽章样式（语义化 tailwind 色，非品牌色硬编码）
function codeStatusClass(status: string): string {
  if (status === "Active") {
    return "bg-green-500/10 border-green-500/30 text-green-400";
  }
  if (status === "Claimable") {
    return "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]";
  }
  // Expired
  return "bg-white/5 border-border text-muted-foreground line-through";
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  // moduleLinkMap 由 page.tsx 注入，本页模块不再使用内部链接（删除内部 URL），
  // 保留 prop 签名避免改动 server 壳，void 占位消除未使用警告
  void moduleLinkMap;
  void locale;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.1keyboardescape.wiki";

  // Structured data
  const robloxGameUrl = "https://www.roblox.com/games/81245647985532/1-Speed-Keyboard-Escape";
  const robloxGroupUrl = "https://www.roblox.com/communities/175742687";
  const discordUrl = "https://discord.com/invite/CMwwcgG33t";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "+1 Speed Keyboard Escape Wiki",
        description:
          "+1 Speed Keyboard Escape Wiki covers Roblox codes, beginner guides, speed farming, rebirth, treadmills, multipliers, trails, auras, stages, events, and ASMR keyboard obby tips.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "+1 Speed Keyboard Escape - Roblox Speed Obby",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "+1 Speed Keyboard Escape Wiki",
        alternateName: "+1 Speed Keyboard Escape",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "+1 Speed Keyboard Escape Wiki - Roblox Speed Obby",
        },
        sameAs: [robloxGameUrl, robloxGroupUrl, discordUrl],
      },
      {
        "@type": "VideoGame",
        name: "+1 Speed Keyboard Escape",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Obby", "Speedrun", "Casual"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 22,
        },
        publisher: {
          "@type": "Organization",
          name: "SecretVerse Studio",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: robloxGameUrl,
        },
      },
      {
        "@type": "VideoObject",
        name: "I Became the #1 Player in +1 Speed Keyboard Escape!",
        description:
          "Gameplay showcase of +1 Speed Keyboard Escape on Roblox — running across candy and chocolate keyboard keys, gaining +1 speed every step, and racing to become the #1 player.",
        uploadDate: "2026-07-07",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/zBsw9A76P_Y",
        url: "https://www.youtube.com/watch?v=zBsw9A76P_Y",
      },
    ],
  };

  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/81245647985532/1-Speed-Keyboard-Escape"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 之后（max-w-5xl 上限，避免挤压广告） */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="zBsw9A76P_Y"
              title="I Became the #1 Player in +1 Speed Keyboard Escape!"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（1:1 锚点，位于视频区之后、Latest Updates 之前） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOL_CARD_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Gift className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.modules.keyboardEscapeCodes.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.keyboardEscapeCodes.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.keyboardEscapeCodes.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.keyboardEscapeCodes.intro}
            </p>
          </div>

          {/* Code Cards */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.keyboardEscapeCodes.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col p-5 md:p-6 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <code className="font-mono text-base md:text-lg font-bold text-[hsl(var(--nav-theme-light))] break-all">
                    {item.code}
                  </code>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${codeStatusClass(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="font-semibold mb-1">{item.reward}</p>
                <p className="text-xs text-muted-foreground mb-3">{item.type}</p>
                <p className="text-sm text-muted-foreground mb-3">{item.howToClaim}</p>
                <div className="mt-auto flex items-start gap-2 pt-3 border-t border-border">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item.bestUse}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Beginner Guide */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.modules.keyboardEscapeBeginnerGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.keyboardEscapeBeginnerGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.keyboardEscapeBeginnerGuide.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.keyboardEscapeBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.keyboardEscapeBeginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center
                                rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)]
                                bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {step.step}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  <p className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span>{step.playerGoal}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Speed Farming Guide (table) */}
      <section id="speed-farming-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.modules.keyboardEscapeSpeedFarming.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.keyboardEscapeSpeedFarming.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.keyboardEscapeSpeedFarming.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.keyboardEscapeSpeedFarming.intro}
            </p>
          </div>

          {/* Farming Table */}
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-left">
                  <th className="p-3 md:p-4 font-semibold whitespace-nowrap">#</th>
                  <th className="p-3 md:p-4 font-semibold whitespace-nowrap">Method</th>
                  <th className="p-3 md:p-4 font-semibold whitespace-nowrap">Requirement</th>
                  <th className="p-3 md:p-4 font-semibold whitespace-nowrap">Speed Gain</th>
                  <th className="p-3 md:p-4 font-semibold">Best Use</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.keyboardEscapeSpeedFarming.items.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t border-border align-top hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-3 md:p-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full
                                       bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.5)]
                                       text-[hsl(var(--nav-theme-light))] font-bold text-xs">
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 font-semibold whitespace-nowrap">{item.method}</td>
                    <td className="p-3 md:p-4 text-muted-foreground whitespace-nowrap">{item.requirement}</td>
                    <td className="p-3 md:p-4 text-[hsl(var(--nav-theme-light))] font-medium">{item.speedGain}</td>
                    <td className="p-3 md:p-4">
                      <p className="text-muted-foreground">{item.bestUse}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">{item.notes}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: Rebirth Guide (progression-timeline) */}
      <section
        id="rebirth-guide"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <RefreshCw className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.modules.keyboardEscapeRebirth.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.keyboardEscapeRebirth.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.keyboardEscapeRebirth.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.keyboardEscapeRebirth.intro}
            </p>
          </div>

          {/* Timeline */}
          <div className="scroll-reveal relative pl-6 md:pl-8 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-5 md:space-y-6">
            {t.modules.keyboardEscapeRebirth.milestones.map((m: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.6rem] md:-left-[2.1rem] top-1 flex items-center justify-center
                                w-8 h-8 md:w-10 md:h-10 rounded-full bg-[hsl(var(--nav-theme))]
                                border-2 border-background">
                  <Trophy className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="p-4 md:p-6 bg-white/5 border border-border rounded-xl
                                hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                        Rebirth {m.rebirth}
                      </span>
                      <h3 className="font-bold text-base md:text-lg">{m.milestone}</h3>
                    </div>
                    <span className="text-lg md:text-2xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {m.multiplier}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/70 mb-0.5">Level Required</p>
                      <p className="font-semibold">{m.levelRequired}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/70 mb-0.5">Resets</p>
                      <p className="text-muted-foreground">{m.whatResets}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/70 mb-0.5">You Gain</p>
                      <p className="text-muted-foreground">{m.whatYouGain}</p>
                    </div>
                  </div>
                  <p className="flex items-start gap-2 text-sm text-muted-foreground pt-3 border-t border-border">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span>{m.bestAction}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* External resource buttons */}
          <div className="scroll-reveal mt-8 md:mt-10 p-5 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1">
                <h3 className="font-bold mb-1 text-[hsl(var(--nav-theme-light))]">
                  Play +1 Speed Keyboard Escape
                </h3>
                <p className="text-sm text-muted-foreground">
                  Jump in, start farming Speed, and put these rebirth milestones into practice.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.roblox.com/games/81245647985532/1-Speed-Keyboard-Escape"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors whitespace-nowrap"
                >
                  Play on Roblox <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://discord.com/invite/CMwwcgG33t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors whitespace-nowrap"
                >
                  Join Discord <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 广告位: Module 4 之后 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 5: Trails and Auras Tier List (tier-grid) */}
      <section id="trails-auras" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.modules.keyboardEscapeTrailsAuras.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.keyboardEscapeTrailsAuras.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.keyboardEscapeTrailsAuras.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.keyboardEscapeTrailsAuras.intro}
            </p>
          </div>

          {/* Tier Grid */}
          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {t.modules.keyboardEscapeTrailsAuras.tiers.map((tier: any, ti: number) => (
              <div
                key={ti}
                className={`flex flex-col rounded-2xl border border-border overflow-hidden
                            ${tier.tier === "S"
                      ? "bg-[hsl(var(--nav-theme)/0.05)] border-[hsl(var(--nav-theme)/0.3)]"
                      : "bg-white/[0.02]"}`}
              >
                {/* Tier Header */}
                <div
                  className={`flex items-center gap-3 p-4 md:p-5 border-b border-border
                              ${tier.tier === "S"
                        ? "bg-[hsl(var(--nav-theme)/0.15)]"
                        : tier.tier === "A"
                          ? "bg-[hsl(var(--nav-theme)/0.08)]"
                          : "bg-white/[0.03]"}`}
                >
                  <span
                    className={`flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl text-xl md:text-2xl font-bold
                                ${tier.tier === "S"
                          ? "bg-[hsl(var(--nav-theme))] text-white"
                          : tier.tier === "A"
                            ? "bg-[hsl(var(--nav-theme)/0.25)] text-[hsl(var(--nav-theme-light))]"
                            : "bg-white/10 text-muted-foreground"}`}
                  >
                    {tier.tier}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base md:text-lg leading-tight">{tier.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{tier.summary}</p>
                  </div>
                </div>
                {/* Tier Items */}
                <div className="flex flex-col divide-y divide-border">
                  {tier.items.map((item: any, ii: number) => (
                    <div key={ii} className="p-4 md:p-5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{item.name}</h4>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap
                                          ${item.type === "Trail"
                                ? "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]"
                                : "bg-white/5 border-border text-muted-foreground"}`}
                            >
                              {item.type}
                            </span>
                          </div>
                        </div>
                        <span className="text-base md:text-lg font-bold text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
                          {item.multiplier}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                        <span>
                          <span className="text-muted-foreground/70">Wins:</span> {item.winsCost}
                        </span>
                        <span>
                          <span className="text-muted-foreground/70">Robux:</span> {item.robuxCost}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.bestFor}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Treadmills Guide (comparison cards) */}
      <section
        id="treadmills"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Activity className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.modules.keyboardEscapeTreadmills.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.keyboardEscapeTreadmills.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.keyboardEscapeTreadmills.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.keyboardEscapeTreadmills.intro}
            </p>
          </div>

          {/* Treadmill Cards */}
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.keyboardEscapeTreadmills.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-6 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Left: name + multiplier + price */}
                  <div className="md:w-1/3 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center min-w-[3.5rem] px-2 h-10 rounded-lg
                                       bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]
                                       text-sm font-bold text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
                        {item.multiplier}
                      </span>
                      <h3 className="font-bold text-base md:text-lg">{item.name}</h3>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] whitespace-nowrap w-fit">
                      {item.price}
                    </span>
                    <p className="text-sm text-muted-foreground">{item.bestFor}</p>
                  </div>
                  {/* Right: pros/cons/recommendation */}
                  <div className="md:flex-1 min-w-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground/70 mb-1.5">Pros</p>
                        <ul className="space-y-1">
                          {item.pros.map((p: string, pi: number) => (
                            <li key={pi} className="flex items-start gap-1.5 text-sm">
                              <Check className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground/70 mb-1.5">Cons</p>
                        <ul className="space-y-1">
                          {item.cons.map((c: string, ci: number) => (
                            <li key={ci} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                              <X className="w-3.5 h-3.5 text-red-400/80 mt-0.5 flex-shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="flex items-start gap-2 text-sm text-muted-foreground pt-3 border-t border-border">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span>{item.recommendation}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: Module 6 之后 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 7: Stages Walkthrough (step-by-step) */}
      <section id="stages" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Route className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.modules.keyboardEscapeStages.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.keyboardEscapeStages.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.keyboardEscapeStages.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.keyboardEscapeStages.intro}
            </p>
          </div>

          {/* Stage Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.keyboardEscapeStages.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center
                                rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)]
                                bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {step.step}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-2">{step.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
                      {step.world}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border text-muted-foreground whitespace-nowrap">
                      {step.stageFocus}
                    </span>
                  </div>
                  <p className="flex items-start gap-2 text-sm md:text-base text-muted-foreground mb-2">
                    <Route className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span>{step.routeTip}</span>
                  </p>
                  <p className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400/80 mt-0.5 flex-shrink-0" />
                    <span>{step.resetRisk}</span>
                  </p>
                  <p className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Trophy className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span>{step.rewardFocus}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Free Rewards (checklist) */}
      <section
        id="free-rewards"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Medal className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.modules.keyboardEscapeFreeRewards.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.keyboardEscapeFreeRewards.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.keyboardEscapeFreeRewards.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.keyboardEscapeFreeRewards.intro}
            </p>
          </div>

          {/* Reward Checklist Cards */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {t.modules.keyboardEscapeFreeRewards.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col p-5 md:p-6 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg
                                   bg-[hsl(var(--nav-theme))] text-white font-bold">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-base md:text-lg">{item.task}</h3>
                </div>
                <p className="text-sm font-semibold text-[hsl(var(--nav-theme-light))] mb-3 px-3 py-2 rounded-lg
                             bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.2)]">
                  {item.reward}
                </p>
                <ol className="space-y-1.5 mb-3">
                  {item.steps.map((s: string, si: number) => (
                    <li key={si} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-auto pt-3 border-t border-border space-y-2">
                  <p className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span>
                      <span className="text-muted-foreground/70">Best time:</span> {item.bestTimeToClaim}
                    </span>
                  </p>
                  <p className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span>{item.whyItMatters}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/CMwwcgG33t"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/81245647985532/1-Speed-Keyboard-Escape"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/175742687"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGroup}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

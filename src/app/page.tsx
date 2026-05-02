import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/mdx'
import { getLatestVideos } from '@/lib/youtube'
import PostCard from '@/components/PostCard'

const PROFILE_IMG  = 'https://blog.kakaocdn.net/dna/bEhoGz/btsGxCdIhZS/AAAAAAAAAAAAAAAAAAAAAJzaZzTCGLpYkVWdoPZPjw1r7k5RgHojEko6RN8ABo8E/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=%2FciwVPkNZBvJGKj7TFiKZtkFnHQ%3D'
const NAVER_IMG    = 'https://blog.kakaocdn.net/dna/bRzGE3/dJMcachBgXD/AAAAAAAAAAAAAAAAAAAAANms6uiI2ZkGl5rLli4UdQER3mKqdpgiNUFOV922QuDp/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=H4fH3dhqMzCC1BYd8EzbdBckdn4%3D'
const TEXTBOOK_IMG = 'https://blog.kakaocdn.net/dna/bYKYjD/btsGygIfz0e/AAAAAAAAAAAAAAAAAAAAABRbA3M4aIhlF2BQqBW6FVzPfTumXjJFI_YLeoj2BFH3/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=H5f%2FaWUPMpcGTxX8J3vy62eGQGs%3D'
const LECTURE_IMG  = 'https://blog.kakaocdn.net/dna/bdy8Q0/btsGzZkYUF0/AAAAAAAAAAAAAAAAAAAAAK9OVvchDE1kLw3aX9KZk8RJZ44M2agpTvMxcpnLSH3G/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=9ZI1Vhpls3KiaukKiuiSR0A%2FXCI%3D'
const EXTRA_IMG    = 'https://blog.kakaocdn.net/dna/pE51A/btsPqnysAIs/AAAAAAAAAAAAAAAAAAAAAIVDEYKvOBoo7it_P1mj1r7RawyYwLamH8i0UBRuTAEQ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1780239599&allow_ip=&allow_referer=&signature=AjVfWnvz7sxAPbav1zUEo90I%2F04%3D'

const BOOKS = [
  '인터넷 진화와 뇌의 종말',
  '인공지능 생존수업',
  '자율주행차가 바꾸는 새로운 세상',
  '디지털 시대의 빛과 그림자',
  '빅브라더와 사생활 종말의 시대',
  '블록체인과 비트코인의 미래',
  '핀테크를 통해 본 금융의 미래',
  '4차산업혁명에 대비하는 우리의 자세',
  '미래를 변화시킬 키워드, 검색',
  '위대한 기술은 세상을 어떻게 바꾸는가',
  '세상을 바꾸는 초일류 기업은 어떻게 탄생하는가',
  '인공지능 로봇이 지배하는 영화같은 세상',
  '페이스북 성공 스토리와 남은 숙제',
  '4년 늦었지만 1위로 성공한 구글 성공 스토리',
]

const LECTURE_TOPICS = [
  '인공지능의 미래',
  '인공지능 프로그래밍',
  '최신 기술 트렌드',
  '인공지능과 직업',
  '세상의 변화',
]

const LECTURE_TARGETS = [
  '기업체 임직원',
  '미래 직업을 고민 중인 학생',
  '공공기관 임직원',
]

const PROGRAMMING_CURRICULUM = [
  '파이썬 기초 프로그래밍',
  '인공지능 기초 수식',
  '선형·로지스틱 회귀 분석',
  '데이터 관리',
  '딥러닝 (CNN, NLP, GAN)',
  '최신 논문 트렌드 분석',
]

const INSTITUTIONS = [
  "미래창조과학부 국제정보통신컨퍼런스 '월드IT쇼'",
  '폴리텍 대학교',
  '숙명여대',
  '호서대학교 기술경영대학원',
  '경상북도 인재개발원',
  '충남경제진흥원',
  'KOICA',
  '한국출판학회',
  '일본계 기업인 협회',
  '전문대학총장협회',
]

export default async function Home() {
  const posts = await getAllPosts()
  const recentPosts = posts.slice(0, 3)
  const videos = await getLatestVideos(3)

  return (
    <div className="space-y-20">

      {/* Hero */}
      <section className="flex flex-col sm:flex-row gap-8 items-start py-10">
        <div className="flex-1 space-y-5">
          <p className="text-sm text-green-mid tracking-widest uppercase">AI Lecturer · Author</p>
          <h1 className="text-4xl font-bold text-gray-900 leading-snug">조중혁</h1>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-deep text-cream text-xs rounded-full font-medium shadow-sm">
            <span>★</span>
            <span>대통령직속 국가인공지능전략위원회 자문위원</span>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            대기업 현직 재직자이자 인공지능 강사·저술가입니다.<br />
            최신 AI 기술을 누구나 이해할 수 있는 언어로 전달합니다.
          </p>
          <div className="flex gap-3 pt-2">
            <Link
              href="/contact"
              className="px-4 py-2 bg-green-deep text-cream text-sm rounded hover:bg-green-mid transition-colors"
            >
              강의 문의
            </Link>
            <Link
              href="/posts"
              className="px-4 py-2 border border-green-deep text-green-deep text-sm rounded hover:bg-green-light transition-colors"
            >
              글 보기
            </Link>
          </div>
        </div>
        <div className="shrink-0 w-40 sm:w-48">
          <Image
            src={PROFILE_IMG}
            alt="조중혁 프로필 사진"
            width={200}
            height={260}
            className="rounded-xl object-cover shadow-md w-full"
          />
        </div>
      </section>

      {/* 경력 지표 */}
      <section className="space-y-4">
        <div className="w-full p-4 rounded-xl border-2 border-green-deep bg-green-deep/5 flex items-center gap-3">
          <span className="text-green-deep text-xl">🏛</span>
          <div>
            <p className="font-bold text-green-deep text-sm">대통령직속 국가인공지능전략위원회 자문위원</p>
            <p className="text-xs text-gray-500 mt-0.5">Presidential AI Strategy Committee Advisory Member</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { num: '15+', label: '저서' },
            { num: '100+', label: '강의 경력' },
            { num: '박사 수료', label: '학력' },
          ].map(({ num, label }) => (
            <div key={label} className="py-6 border border-border rounded-lg">
              <p className="text-2xl font-bold text-green-deep">{num}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 주요 이력 */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">주요 이력</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500 font-medium">네이버 인물 소개 등재</p>
            <Image
              src={NAVER_IMG}
              alt="네이버 인물 소개"
              width={600}
              height={340}
              className="rounded-lg border border-border object-cover w-full"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 font-medium">고등학교 국어 교과서 수록 저자</p>
            <Image
              src={TEXTBOOK_IMG}
              alt="고등학교 국어 교과서 수록"
              width={600}
              height={340}
              className="rounded-lg border border-border object-cover w-full"
            />
          </div>
        </div>
      </section>

      {/* 강의 대상 */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">강의 대상</h2>
        <div className="flex flex-wrap gap-3">
          {LECTURE_TARGETS.map(target => (
            <span
              key={target}
              className="px-4 py-2 bg-green-light text-green-deep text-sm rounded-full border border-green-deep/20"
            >
              {target}
            </span>
          ))}
        </div>
      </section>

      {/* 강의 주제 */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">강의 주제</h2>
        <div className="flex flex-wrap gap-3">
          {LECTURE_TOPICS.map(topic => (
            <span
              key={topic}
              className="px-4 py-2 border border-border text-gray-700 text-sm rounded-full hover:border-green-deep hover:text-green-deep transition-colors"
            >
              {topic}
            </span>
          ))}
        </div>
      </section>

      {/* 강의 형식 */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">강의 형식</h2>
        <div className="rounded-xl overflow-hidden border border-border">
          <Image
            src={LECTURE_IMG}
            alt="강의 현장"
            width={900}
            height={420}
            className="object-cover w-full max-h-72"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* 특강 */}
          <div className="p-5 bg-green-light/40 border border-green-light rounded-lg space-y-3">
            <div>
              <p className="font-bold text-green-deep text-lg">특강</p>
              <p className="text-xs text-green-mid mt-0.5">2시간 · 온/오프라인</p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              인공지능의 개념과 최신 기술 트렌드를 쉽게 설명하고,
              우리 삶의 변화에 대해 이야기합니다.
            </p>
          </div>
          {/* AI 프로그래밍 */}
          <div className="p-5 bg-green-light/40 border border-green-light rounded-lg space-y-3">
            <div>
              <p className="font-bold text-green-deep text-lg">AI 프로그래밍</p>
              <p className="text-xs text-green-mid mt-0.5">10시간 · 온/오프라인</p>
            </div>
            <ul className="space-y-1">
              {PROGRAMMING_CURRICULUM.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-mid mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 출강 기관 */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">출강 기관 <span className="text-sm font-normal text-gray-400">(100회 이상)</span></h2>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
          {INSTITUTIONS.map(inst => (
            <li key={inst} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-deep shrink-0" />
              {inst}
            </li>
          ))}
        </ul>
      </section>

      {/* 저서 */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">저서 <span className="text-sm font-normal text-gray-400">(15권)</span></h2>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <ul className="flex-1 grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {BOOKS.map(book => (
              <li key={book} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-deep mt-0.5 shrink-0">—</span>
                {book}
              </li>
            ))}
            <li className="flex items-center gap-2 text-sm text-gray-400">
              <span className="shrink-0 w-4" />
              외 다수
            </li>
          </ul>
          <div className="shrink-0">
            <Image
              src={EXTRA_IMG}
              alt="저서 관련 이미지"
              width={260}
              height={200}
              className="rounded-lg border border-border object-cover"
            />
          </div>
        </div>
      </section>

      {/* 유튜브 최신 영상 */}
      {videos.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">유튜브 강의</h2>
            <a
              href="https://www.youtube.com/channel/UC4rltdhd9DYMKL6dCB3RLgQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-deep hover:text-green-mid transition-colors"
            >
              채널 전체 보기 →
            </a>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {videos.map(video => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl overflow-hidden border border-border hover:border-green-deep transition-colors"
              >
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-green-deep transition-colors">
                    {video.title}
                  </p>
                  <p className="text-xs text-gray-400">{video.published}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 최근 글 */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">최근 글</h2>
          <Link href="/posts" className="text-sm text-green-deep hover:text-green-mid transition-colors">
            전체 보기 →
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <p className="text-gray-400 text-sm">아직 작성된 글이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {recentPosts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* 강의 문의 */}
      <section className="space-y-4 py-8 border-t border-border">
        <h2 className="text-xl font-semibold text-gray-800">강의 문의</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          기업체, 학교, 공공기관 강의 문의는 아래로 연락 주세요.
        </p>
        <div className="space-y-1.5 text-sm text-gray-700">
          <p>이메일 · <a href="mailto:doimoi@kakao.com" className="text-green-deep hover:underline">doimoi@kakao.com</a></p>
          <p>카카오톡 · <span className="text-green-deep">doimoi00</span> (도이모이 공공)</p>
        </div>
        <Link
          href="/contact"
          className="inline-block mt-2 px-5 py-2.5 bg-green-deep text-cream text-sm rounded-lg hover:bg-green-mid transition-colors"
        >
          문의 폼 바로가기 →
        </Link>
      </section>

    </div>
  )
}

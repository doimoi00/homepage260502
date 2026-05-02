export default function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="max-w-3xl mx-auto px-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()}. 모든 글의 저작권은 작성자에게 있습니다.
      </div>
    </footer>
  )
}

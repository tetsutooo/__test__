# [LINK](https://tetsutooo.github.io/__test__/)
テキスト
**太字テキスト**
*斜体*
~~取り消し線~~
***太字かつ斜体***
文字<sub>下付き文字</sub>
文字<sup>上付き文字</sup>
## A second-level heading
>テキストの引用

コマンドの引用`command`
`#0969DA`
`rgb(9, 105, 218)`
`hsl(212, 92%, 45%)`

This site was built using [GitHub Pages](https://pages.github.com/).
### A third-level heading
数式はLaTeX形式をサポート
$f(x)=\sqrt{x^2-x+3}$
right?

$$E=mc^2$$

---
### 環境構築
RustとWebAssembly用のツールチェーンがインストールされていることを確認。
```
rustup target add wasm32-unknown-unknown
cargo install wasm-pack
```
新しいRustプロジェクトの作成
```
cargo new --lib wasm_math
cd wasm_math
```

### ビルド
```
wasm-pack build --target web
```
- Cargo.toml
- src/ (いらない？)
- pkg/
- .gitignore
をpush.

.gitignoreには以下の編集を加える
```
/target
   Cargo.lock
```



---
Claude 3.5 Sonnetで作成

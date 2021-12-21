import { match } from 'ts-pattern';

function main() {
    let currentPage = window.location.href;

    match<string>(currentPage)
        .when(
            url => /.+\/pulls(\?.*)?/.test(url),
            () => {
                let issuesNode = document.querySelectorAll('div[aria-label="Issues"]');
                let issues = Array.from(issuesNode[0]!.children[0]!.children) as HTMLElement[];
                issues
                    .filter((issue: Element) => issue.getElementsByClassName("color-fg-danger").length > 0)
                    .forEach((issue) => issue.style.backgroundColor = "lightcoral")
            }
        )
        .otherwise(() => null)

    // Turbolinksみたいなのに対応できないので再起してゴリ押す
    setTimeout(() => main(), 333);
}

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        // これでもGitHubのページ遷移には対応できない…
        main();
    }
  }

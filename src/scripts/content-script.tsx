import { match } from 'ts-pattern';

function main() {
    try {
        process()
    } finally {
        // Turbolinksみたいなのに対応できないので再起してゴリ押す
        setTimeout(() => main(), 333);
    }
}

function process() {
    let currentPage = window.location.href;

    match<string>(currentPage)
        .when(
            url => /.+\/pulls(\?.*)?/.test(url),
            () => colorPullRequestItems()
        )
        .otherwise(() => null)
}

function colorPullRequestItems() {
    let issuesNode = document.querySelectorAll('div[aria-label="Issues"]');
    let issues = Array.from(issuesNode[0]!.children[0]!.children) as HTMLElement[];

    // Actions失敗
    issues
        .filter((issue: Element) => issue.getElementsByClassName("octicon-x").length > 0)
        .forEach((issue) => issue.style.backgroundColor = "lightcoral")

    // Actions実行中
    issues
        .filter((issue: Element) => issue.getElementsByClassName("hx_dot-fill-pending-icon").length > 0)
        .forEach((issue) => issue.style.backgroundColor = "moccasin")
}

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        // これでもGitHubのページ遷移には対応できない…
        main();
    }
  }

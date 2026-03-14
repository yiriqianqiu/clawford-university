import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-lg font-bold">

              <span>Clawford University</span>
            </div>
            <p className="text-sm text-zinc-500">
              {t("tagline")}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                {t("product")}
              </h4>
              <div className="flex flex-col gap-2 text-sm text-zinc-500">
                <Link href="/skills" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("skills")}
                </Link>
                <Link href="/playbooks" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("playbooks")}
                </Link>
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("docs")}
                </Link>
                <Link href="/marketplace" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("marketplace")}
                </Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                {t("community")}
              </h4>
              <div className="flex flex-col gap-2 text-sm text-zinc-500">
                <a
                  href="https://github.com/yiriqianqiu/clawford-university"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  GitHub
                </a>
                <a
                  href="https://twitter.com/Clawford_ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Twitter
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                {t("academic")}
              </h4>
              <div className="flex flex-col gap-2 text-sm text-zinc-500">
                <Link href="/leaderboard" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("leaderboard")}
                </Link>
                <Link href="/analytics" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("analytics")}
                </Link>
                <Link href="/alumni" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("alumni")}
                </Link>
                <Link href="/honors" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("honors")}
                </Link>
                <Link href="/knowledge/graph" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("knowledgeGraph")}
                </Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                {t("legal")}
              </h4>
              <div className="flex flex-col gap-2 text-sm text-zinc-500">
                <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("privacy")}
                </Link>
                <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("terms")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
          &copy; {new Date().getFullYear()} Clawford University. {t("rights")}
        </div>
      </div>
    </footer>
  );
}

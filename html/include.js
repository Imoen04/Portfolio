function getSitePathFromRoot(pathname) {
    const normalized = pathname.replace(/\\/g, "/");
    const segments = normalized.split("/").filter(Boolean);
    const rootIndex = segments.lastIndexOf("Portefolio");

    if (rootIndex === -1) {
        return segments.join("/");
    }

    return segments.slice(rootIndex + 1).join("/");
}

function getRelativeHref(targetPathFromRoot, currentPathname) {
    const currentPath = getSitePathFromRoot(currentPathname);
    const currentDir = currentPath.includes("/")
        ? currentPath.substring(0, currentPath.lastIndexOf("/"))
        : "";

    const fromParts = currentDir ? currentDir.split("/") : [];
    const toParts = targetPathFromRoot.split("/");

    let commonLength = 0;
    while (
        commonLength < fromParts.length &&
        commonLength < toParts.length &&
        fromParts[commonLength] === toParts[commonLength]
    ) {
        commonLength += 1;
    }

    const upParts = fromParts.slice(commonLength).map(() => "..");
    const relParts = [...upParts, ...toParts.slice(commonLength)];

    return relParts.join("/") || ".";
}

function applyHeaderNavigation(headerElement) {
    const navLinks = headerElement.querySelectorAll("[data-nav]");
    const targets = {
        accueil: "index.html",
        projets: "html/projet/projets.html",
        parcours: "html/parcours/parcours.html",
        apropos: "html/a_propos/a_propos.html"
    };

    navLinks.forEach(function (link) {
        const key = link.getAttribute("data-nav");
        if (targets[key]) {
            link.setAttribute("href", getRelativeHref(targets[key], window.location.pathname));
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const includes = document.querySelectorAll("[data-include]");

    includes.forEach(async function (el) {
        const file = el.dataset.include;
        const includeUrl = file + "?v=" + Date.now();
        try {
            const response = await fetch(includeUrl, { cache: "no-store" });
            if (!response.ok) {
                throw new Error("Erreur de chargement : " + response.status);
            }
            el.innerHTML = await response.text();

            if (el.classList.contains("site-header")) {
                applyHeaderNavigation(el);
            }
        } catch (error) {
            console.error("Impossible d'inclure", file, error);
            el.innerHTML = "<!-- Inclusion introuvable : " + file + " -->";
        }
    });
});

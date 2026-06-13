const leaderboardList =
    document.getElementById("leaderboard-list");

async function loadLeaderboard() {
    try {
        // Load sample leaderboard
        const response =
            await fetch("leaderboard.json");

        let leaderboard =
            await response.json();

        // Load current user's leaderboard
        const localScores =
            JSON.parse(
                localStorage.getItem("leaderboard")
            ) || [];

        // Merge both arrays
        leaderboard = [
            ...leaderboard,
            ...localScores
        ];

        // Sort highest score first
        leaderboard.sort(
            (a, b) => b.score - a.score
        );

        leaderboardList.innerHTML = "";

        leaderboard.forEach(player => {
            const li =
                document.createElement("li");

            li.textContent =
                `${player.name} - ${player.score} points`;

            leaderboardList.appendChild(li);
        });

    } catch (error) {
        console.error(error);

        leaderboardList.innerHTML =
            "<li>Failed to load leaderboard.</li>";
    }
}

function clearBoard() {
    localStorage.removeItem("leaderboard");
    loadLeaderboard();
}

loadLeaderboard();
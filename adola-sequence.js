document.addEventListener("DOMContentLoaded", () => {
    const sequence = document.getElementById("adola-sequence");
    if (!sequence) {
        return;
    }

    const stages = [
        "is-scrolling",
        "is-selected",
        "is-dialing",
        "is-to-twilio",
        "is-to-openai-sip",
        "is-to-bot",
        "is-incoming",
        "is-bot-speaking",
        "is-customer-speaking",
        "is-hanging-up",
        "is-answered"
    ];
    const httpStages = ["is-http-active"];
    const rtpStage = "is-rtp-established";
    const httpTool = sequence.querySelector("[data-http-tool]");
    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timers = [];

    if (prefersReducedMotion) {
        setStage("is-answered");
        sequence.classList.add(rtpStage);
        bindRestartButtons();
        return;
    }

    bindRestartButtons();
    runCycle();

    function runCycle() {
        clearTimers();
        clearStages();
        sequence.classList.remove(rtpStage);

        timers = [
            window.setTimeout(() => setStage("is-scrolling"), 350),
            window.setTimeout(() => setStage("is-selected"), 1900),
            window.setTimeout(() => setStage("is-dialing"), 2700),
            window.setTimeout(() => setStage("is-to-twilio"), 3900),
            window.setTimeout(() => setStage("is-to-openai-sip"), 5100),
            window.setTimeout(() => setStage("is-to-bot"), 6300),
            window.setTimeout(() => setStage("is-incoming"), 7000),
            window.setTimeout(() => setStage("is-bot-speaking"), 7800),
            window.setTimeout(() => startHttpFlow("get_customer_info"), 8050),
            window.setTimeout(() => setStage("is-customer-speaking"), 10400),
            window.setTimeout(() => setStage("is-bot-speaking"), 11800),
            window.setTimeout(() => startHttpFlow("get_open_slots"), 11850),
            window.setTimeout(() => setStage("is-customer-speaking"), 13200),
            window.setTimeout(() => setStage("is-bot-speaking"), 14600),
            window.setTimeout(() => startHttpFlow("check_patient_notes"), 14700),
            window.setTimeout(() => setStage("is-customer-speaking"), 16200),
            window.setTimeout(() => setStage("is-bot-speaking"), 17400),
            window.setTimeout(() => startHttpFlow("reserve_booking_slot"), 17500),
            window.setTimeout(() => setStage("is-customer-speaking"), 20200),
            window.setTimeout(() => setStage("is-bot-speaking"), 21600),
            window.setTimeout(() => startHttpFlow("send_confirmation"), 21700),
            window.setTimeout(() => setStage("is-customer-speaking"), 24400),
            window.setTimeout(() => setStage("is-bot-speaking"), 25800),
            window.setTimeout(() => startHttpFlow("write_call_summary"), 25850),
            window.setTimeout(() => setStage("is-customer-speaking"), 27200),
            window.setTimeout(() => setStage("is-hanging-up"), 28600),
            window.setTimeout(runCycle, 29600)
        ];
    }

    function bindRestartButtons() {
        document.querySelectorAll("[data-restart-sequence]").forEach((button) => {
            button.addEventListener("click", () => {
                if (prefersReducedMotion) {
                    setStage("is-answered");
                    return;
                }

                runCycle();
            });
        });
    }

    function setStage(stage) {
        clearStages();
        sequence.classList.add(stage);

        if (stage === "is-incoming") {
            sequence.classList.add(rtpStage);
        }
    }

    function startHttpFlow(toolName) {
        clearHttpStages();
        if (httpTool) {
            httpTool.textContent = toolName;
        }

        void sequence.offsetWidth;
        sequence.classList.add("is-http-active");
        timers.push(window.setTimeout(clearHttpStages, 1350));
    }

    function clearStages() {
        stages.forEach((stage) => sequence.classList.remove(stage));
        clearHttpStages();
    }

    function clearHttpStages() {
        httpStages.forEach((stage) => sequence.classList.remove(stage));
    }

    function clearTimers() {
        timers.forEach((timer) => window.clearTimeout(timer));
        timers = [];
    }
});

Add-Type -AssemblyName System.Speech

$scenes = @(
    @{
        id = 1
        img = "demo_video\scene1_title.png"
        wav = "demo_video\scene1.wav"
        mp4 = "demo_video\scene1.mp4"
        text = "Welcome to Able AI, an autonomous finance and micro habit platform built for the PayPal AI Hackathon."
    },
    @{
        id = 2
        img = "demo_video\scene2_standalone_overview.png"
        wav = "demo_video\scene2.wav"
        mp4 = "demo_video\scene2.mp4"
        text = "Students and young adults receive lump sums, but high spending velocity often leads to empty balances before the term ends. Able AI continuously calculates your daily safe spend ceiling, keeping your cash flow balanced."
    },
    @{
        id = 3
        img = "demo_video\scene3_paypal_modal.png"
        wav = "demo_video\scene3.wav"
        mp4 = "demo_video\scene3.mp4"
        text = "When Gemini AI detects a spending surplus, users can approve micro transfers with a single click, executing directly through the PayPal Sandbox Orders API."
    },
    @{
        id = 4
        img = "demo_video\scene4_savings_buckets.png"
        wav = "demo_video\scene4.wav"
        mp4 = "demo_video\scene4.mp4"
        text = "Autonomous savings buckets automate rules like Friday sweeps or spare change roundups, turning small daily savings into emergency cushions."
    },
    @{
        id = 5
        img = "demo_video\scene5_group_goals.png"
        wav = "demo_video\scene5.wav"
        mp4 = "demo_video\scene5.mp4"
        text = "Collaborative pools let roommates split trips and bills using PayPal handles. When fully funded, Able AI automatically disburses the funds using the PayPal Payouts API."
    },
    @{
        id = 6
        img = "demo_video\scene6_ag_grid_ledger.png"
        wav = "demo_video\scene6.wav"
        mp4 = "demo_video\scene6.mp4"
        text = "Every transaction is recorded in our enterprise live ledger powered by AG Grid, featuring multi-column sorting, live filtering, and one-click CSV export."
    },
    @{
        id = 7
        img = "demo_video\scene7_spreadsheet_import.png"
        wav = "demo_video\scene7.wav"
        mp4 = "demo_video\scene7.mp4"
        text = "Traditional budgeters do not need to start over. Users can upload an Excel or Google Sheets budget, and Gemini automatically extracts their categories, balances, and safe spend limits."
    },
    @{
        id = 8
        img = "demo_video\scene8_paypal_mobile_app.png"
        wav = "demo_video\scene8.wav"
        mp4 = "demo_video\scene8.mp4"
        text = "Able AI is also built to live natively inside the PayPal mobile app. Users can view their safe spend dial on their home feed and execute one-tap sweeps directly from their PayPal balance."
    },
    @{
        id = 9
        img = "demo_video\scene9_checkout_guardrail.png"
        wav = "demo_video\scene9.wav"
        mp4 = "demo_video\scene9.mp4"
        text = "During online shopping, the Able AI guardrail intercepts checkouts that exceed your daily limit, offering intelligent peer-to-peer split options before payment authorization."
    },
    @{
        id = 10
        img = "demo_video\scene10_copilot_drawer.png"
        wav = "demo_video\scene10.wav"
        mp4 = "demo_video\scene10.mp4"
        text = "Our conversational agentic copilot answers affordability questions and drafts executable PayPal payment payloads directly inside the chat window."
    },
    @{
        id = 11
        img = "demo_video\scene11_outro.png"
        wav = "demo_video\scene11.wav"
        mp4 = "demo_video\scene11.mp4"
        text = "Able AI bridges autonomous intelligence with the PayPal developer platform to turn little habits into big benefits. Thank you for watching."
    }
)

Write-Host "--- Generating Voice Tracks ---"
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = 0 # Normal, natural pace

foreach ($s in $scenes) {
    Write-Host "Synthesizing audio for Scene $($s.id)..."
    $synth.SetOutputToWaveFile($s.wav)
    $synth.Speak($s.text)
}
$synth.Dispose()

Write-Host "--- Encoding Scene Videos with FFmpeg ---"
$concatList = "demo_video\concat_list.txt"
if (Test-Path $concatList) { Remove-Item $concatList }

foreach ($s in $scenes) {
    Write-Host "Encoding Scene $($s.id)..."
    # Create video matching audio duration + 0.5s padding
    & ffmpeg -y -loop 1 -i $s.img -i $s.wav -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -movflags +faststart $s.mp4 2>$null
    "file '$([System.IO.Path]::GetFileName($s.mp4))'" | Out-File -Append -FilePath $concatList -Encoding ascii
}

Write-Host "--- Concatenating Final Video: able_ai_demo.mp4 ---"
Push-Location demo_video
& ffmpeg -y -f concat -safe 0 -i concat_list.txt -c copy "..\able_ai_demo.mp4" 2>$null
Pop-Location

if (Test-Path "able_ai_demo.mp4") {
    $size = (Get-Item "able_ai_demo.mp4").Length / 1MB
    Write-Host "SUCCESS! Video generated: able_ai_demo.mp4 ($([math]::Round($size, 2)) MB)"
} else {
    Write-Host "ERROR: Video generation failed."
}

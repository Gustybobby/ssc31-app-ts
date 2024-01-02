export function FetchingSVG(){
    return(
        <svg className="fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="120px" height="150px" viewBox="0 0 120 150">
            <rect x="0" y="50" width="20" height="50" opacity="0.2">
            <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="height" attributeType="XML" values="50; 100; 50" begin="0s" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="y" attributeType="XML" values="50; 25; 50" begin="0s" dur="0.6s" repeatCount="indefinite" />
            </rect>
            <rect x="40" y="50" width="20" height="50" opacity="0.2">
            <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="height" attributeType="XML" values="50; 100; 50" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="y" attributeType="XML" values="50; 25; 50" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
            </rect>
            <rect x="80" y="50" width="20" height="50" opacity="0.2">
            <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="height" attributeType="XML" values="50; 100; 50" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="y" attributeType="XML" values="50; 25; 50" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
            </rect>
        </svg>
    )
}
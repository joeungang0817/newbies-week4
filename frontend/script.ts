import { json } from "node:stream/consumers";

document.getElementById('calculate')!.addEventListener('click', async () => {
    const lhs = parseInt((document.getElementById('lhs') as HTMLInputElement).value);
    const rhs = parseInt((document.getElementById('rhs') as HTMLInputElement).value);
    const operator = (document.getElementById('operator') as HTMLSelectElement).value;

    // 서버에 POST 요청하여 결과 저장
    const response = await fetch(`http://localhost:4000/arithmetics/result`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            lhs: lhs, // 왼쪽 값
            rhs: rhs, // 오른쪽 값
            operator: operator // 선택된 연산자
        }),
    });

    if (response.ok) {
        console.log('Result saved to database');
        
        // 결과를 가져와서 표시하는 함수
        const response_display = await fetch(`http://localhost:4000/arithmetics/arithmetic/${operator}?lhs=${lhs}&rhs=${rhs}`, {
            method: 'GET',
        });

        if (response_display.ok) {
            console.log('Successful get!');
            const data = await response_display.json();
            const resultField = document.getElementById('result') as HTMLInputElement;
                if (resultField) {
                    resultField.value = data.result;
                }
            };
        } else {
            console.error('Failed to retrieve result');
        }
    }
);

// 결과 삭제 함수
const deleteResult = async (id: number) => {
    const response = await fetch(`http://localhost:4000/arithmetics/result/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        console.log('Result deleted successfully');
        // UI에서 해당 결과 삭제
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.innerHTML = resultsDiv.innerHTML.replace(
                new RegExp(`.*${id}.*<button onclick="deleteResult\\(${id}\\)">x</button></p>`, 'g'),
                ''
            );
        }
    } else {
        console.error('Failed to delete result');
    }
};

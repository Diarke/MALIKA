from django.shortcuts import render, redirect
from .models import Subject, Questions, Answers, History, UserAnswer
from django.core.paginator import Paginator
from django.http import Http404

# Create your views here.
def index(request):
    subjects = Subject.objects.all()
    return render(request, 'index.html', {'subjects': subjects})

def history(request):
    history = History.objects.filter(user=request.user).order_by('-created_at')
    paginator = Paginator(history, 5)  # Пагинация: 5 записей на страницу
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'history.html', {'page_obj': page_obj})

def test_view(request, pk):
    subject = Subject.objects.get(id=pk)
    questions = Questions.objects.filter(subject_id=subject)

    if request.method == 'POST':
        score = 0
        # Создаем запись в истории
        history = History.objects.create(
            user=request.user,
            subject=subject,
            total=questions.count(),
            score=0  # Временно 0, обновим после подсчета
        )

        # Обрабатываем ответы пользователя
        for question in questions:
            selected_answer_id = request.POST.get(str(question.id))
            if selected_answer_id:
                answer = Answers.objects.get(id=selected_answer_id)
                is_correct = answer.is_correct
                if is_correct:
                    score += 1

                # Сохраняем ответ пользователя
                UserAnswer.objects.create(
                    history=history,
                    question=question,
                    selected_answer=answer,
                    is_correct=is_correct
                )

        # Обновляем score в истории
        history.score = score
        history.save()

        return redirect('result', history_id=history.id)

    return render(request, 'test.html', {'subject': subject, 'questions': questions})

def result_view(request, history_id):
    history = History.objects.get(id=history_id)
    score = history.score
    total = history.total
    correct_percentage = (score / total) * 100 if total > 0 else 0
    return render(request, 'result.html', {
        'test_subject': history.subject.name,
        'score': score,
        'total': total,
        'correct_percentage': correct_percentage,
    })

def test_detail(request, history_id):
    history = History.objects.get(id=history_id)
    user_answers = history.user_answers.all()

    # Добавим отладку
    print(f"History ID: {history_id}, User: {request.user}, Subject: {history.subject.name}")
    print(f"Number of User Answers: {user_answers.count()}")

    # Подготавливаем данные для шаблона
    answers_with_details = []
    for user_answer in user_answers:
        question = user_answer.question
        all_answers = question.answers_set.all()
        correct_answer = all_answers.filter(is_correct=True).first()
        answers_with_details.append({
            'user_answer': user_answer,
            'question': question,
            'all_answers': all_answers,
            'correct_answer': correct_answer.answer if correct_answer else "Нет правильного ответа",
            'selected_answer': user_answer.selected_answer
        })

    return render(request, 'test_detail.html', {
        'test_subject': history.subject.name,
        'answers_with_details': answers_with_details
    })


def chemistry_xmind_game(request):
    return render(request, 'chemistry_xmind_game.html')


def game1(request):
    return render(request, 'game1.html')


def game2(request):
    return render(request, 'game2.html')
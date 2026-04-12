import type { CourseResponse } from '../types/course';

export const MOCK_COURSE: CourseResponse = {
  courseTitle: 'Mastering Pointers in C++',
  topic: 'Pointers in C++',
  lessons: [
    {
      lessonNumber: 1,
      title: 'Introduction to Pointers',
      objective:
        'Understand what pointers are, how they store memory addresses, and how to declare and dereference them.',
      keyConcepts: ['Memory Address', 'Pointer Declaration', 'Dereferencing', 'Null Pointer', 'Address-of Operator'],
      estimatedMinutes: 20,
      content: {
        introduction:
          "Pointers are one of the most powerful — and most misunderstood — features of C++. At their core, a pointer is simply a variable that stores a memory address rather than a direct value. Understanding pointers unlocks low-level memory control, efficient data structures, and a much deeper understanding of how computers actually work.",
        mainContent: "**What is a Pointer?**\nEvery variable you declare occupies some location in memory, identified by an address. A pointer is a variable whose value is that address. We declare a pointer using the * symbol:\n\n`int* ptr;`\n\nThis declares ptr as a pointer to int. It does not yet point anywhere useful — it must be initialized before use.\n\n**The Address-of Operator (&)**\nTo get the memory address of a variable, use the & operator:\n\n`int x = 42;\nint* ptr = &x;`\n\nNow ptr holds the address of x. Printing ptr gives you something like 0x7ffd5b2c4abc — a hexadecimal address.\n\n**Dereferencing a Pointer**\nTo read or write the value at the address stored in a pointer, use the * (dereference) operator:\n\n`cout << *ptr; // prints 42\n*ptr = 100;    // x is now 100`\n\n**Null Pointers**\nAlways initialize pointers. Use nullptr (C++11 onwards) to indicate points to nothing:\n\n`int* safePtr = nullptr;`\n\nDereferencing a null pointer causes undefined behavior — typically a crash.",
        summary:
          "Pointers store memory addresses of other variables. Use & to take an address, and * to dereference. Always initialize pointers, using nullptr when no target is available. This foundation is essential for everything that follows.",
        practiceQuestions: [
          {
            question: 'What does the & operator do when applied to a variable?',
            hint: 'Think about what piece of information about a variable you are retrieving.',
            answer: 'It returns the memory address of the variable.',
          },
          {
            question: 'If ptr points to an integer x = 5, what does *ptr = 10 do?',
            hint: 'The * operator accesses the value at the pointer address.',
            answer: 'It changes the value of x to 10 through the pointer.',
          },
          {
            question: 'Why should you initialize a pointer to nullptr if you do not have a target?',
            hint: 'Consider what happens when you try to use an uninitialized pointer.',
            answer: 'To avoid undefined behavior — dereferencing an uninitialized pointer causes a crash or corrupted memory.',
          },
        ],
      },
      video: {
        videoId: 'dtkaUwpbhHo',
        title: 'Pointers in C++ - Complete Introduction',
        channelName: 'The Cherno',
      },
      quiz: [
        {
          question: 'Which symbol is used to declare a pointer in C++?',
          options: ['&', '*', '#', '@'],
          correctAnswer: '*',
        },
        {
          question: 'What does the address-of operator & return?',
          options: ['The value of a variable', 'The memory address of a variable', 'A copy of the variable', 'The size of a variable'],
          correctAnswer: 'The memory address of a variable',
        },
        {
          question: 'What is the recommended way to initialize a pointer that does not yet have a target?',
          options: ['int* p = 0;', 'int* p = NULL;', 'int* p = nullptr;', 'Leave it uninitialized'],
          correctAnswer: 'int* p = nullptr;',
        },
      ],
    },
    {
      lessonNumber: 2,
      title: 'Pointer Arithmetic & Arrays',
      objective:
        'Learn how pointer arithmetic works, understand the relationship between arrays and pointers, and use pointers to traverse arrays efficiently.',
      keyConcepts: ['Pointer Arithmetic', 'Array Decay', 'Subscript vs Pointer', 'Pointer Increment', 'Bounds Safety'],
      estimatedMinutes: 25,
      content: {
        introduction:
          "One of pointer's most elegant properties is arithmetic: you can add or subtract integers to move through memory in a structured way. This is the secret behind how arrays work internally in C++, and it is the foundation for building efficient iterators and data structure traversal algorithms.",
        mainContent: "**Pointer Arithmetic**\nWhen you do ptr + 1, it does not add 1 byte — it adds sizeof(*ptr) bytes. So for an int* on a 64-bit system:\n\n`int arr[] = {10, 20, 30};\nint* ptr = arr;\nptr++;         // now points to arr[1]\ncout << *ptr;  // 20`\n\n**Arrays Are Pointers (Almost)**\nAn array name in C++ decays to a pointer to its first element:\n\n`int arr[3] = {1, 2, 3};\nint* p = arr;  // same as &arr[0]`\n\nThis is called array decay. The pointer and array notations are interchangeable:\n\n`*(p + 2) == arr[2] == p[2]  // all equal 3`\n\n**Traversing with Pointers**\nYou can walk through an array using a pointer:\n\n`for (int* it = arr; it != arr + 3; ++it) {\n    cout << *it << \" \";\n}`\n\n**Bounds Safety**\nC++ does not check array bounds for you. Going past the end of an array results in undefined behavior. Always know your array size.",
        summary:
          "Pointer arithmetic moves by element size, not bytes. Array names decay to pointers to their first element, making subscript and pointer notation equivalent. Traversing arrays with pointers is idiomatic C++ but requires careful bounds management.",
        practiceQuestions: [
          {
            question: 'If ptr points to arr[0] of an int array, what does ptr + 2 point to?',
            hint: 'Pointer arithmetic skips by sizeof(element), not by bytes.',
            answer: 'It points to arr[2], the third element.',
          },
          {
            question: 'Are arr[i] and *(arr + i) equivalent?',
            hint: 'Consider how the subscript operator is defined in terms of pointer arithmetic.',
            answer: 'Yes, they are completely equivalent expressions.',
          },
          {
            question: 'What is "array decay" in C++?',
            hint: 'Think about what happens when you pass an array to a function.',
            answer: 'An array name implicitly converts to a pointer to its first element.',
          },
        ],
      },
      video: {
        videoId: 'p-5-msICBkI',
        title: 'Arrays and Pointers in C++',
        channelName: 'CodeVault',
      },
      quiz: [
        {
          question: 'If int* ptr points to arr[1], what does ptr - 1 point to?',
          options: ['arr[0]', 'arr[2]', 'An arbitrary address', 'nullptr'],
          correctAnswer: 'arr[0]',
        },
        {
          question: 'Which expression is NOT equivalent to arr[3] for an int array?',
          options: ['*(arr + 3)', '3[arr]', '*(3 + arr)', '&arr + 3'],
          correctAnswer: '&arr + 3',
        },
        {
          question: 'What happens when you access memory beyond the array bounds in C++?',
          options: ['An exception is thrown', 'The program crashes safely', 'Undefined behavior', 'A bounds error is returned'],
          correctAnswer: 'Undefined behavior',
        },
      ],
    },
    {
      lessonNumber: 3,
      title: 'Dynamic Memory & Smart Pointers',
      objective:
        'Understand heap allocation with new/delete, learn why raw pointers cause memory leaks, and use smart pointers to manage memory safely.',
      keyConcepts: ['Heap vs Stack', 'new & delete', 'Memory Leak', 'unique_ptr', 'shared_ptr', 'RAII'],
      estimatedMinutes: 30,
      content: {
        introduction:
          "So far, our pointers have pointed to stack-allocated variables with automatic lifetimes. But what if you need memory that persists beyond a function call, or whose size is not known at compile time? That is where heap allocation — and the critical topic of memory management — comes in.",
        mainContent: "**Stack vs Heap**\nStack memory is automatically managed: it is allocated when a function is called and freed when it returns. Heap memory is manual: you allocate it with new and must free it with delete:\n\n`int* p = new int(42);\ncout << *p;    // 42\ndelete p;      // free the memory\np = nullptr;   // good practice`\n\n**Memory Leaks**\nIf you forget to delete, the memory stays allocated until the program exits — a leak. In long-running programs, leaks accumulate and eventually exhaust memory.\n\n**The RAII Principle**\nC++ embraces RAII (Resource Acquisition Is Initialization): tie resource lifetimes to object lifetimes. Smart pointers implement this automatically.\n\n**unique_ptr — Exclusive Ownership**\n`unique_ptr<int> p = make_unique<int>(42);`\nAutomatically deletes when out of scope. Cannot be copied — only moved.\n\n**shared_ptr — Shared Ownership**\n`shared_ptr<int> p1 = make_shared<int>(99);\nshared_ptr<int> p2 = p1; // reference count = 2`\nMemory freed when the last shared_ptr goes out of scope.\n\n**Prefer Smart Pointers**\nIn modern C++, prefer unique_ptr and shared_ptr over raw new/delete. They eliminate entire categories of bugs.",
        summary:
          "Heap memory gives you control over object lifetimes at the cost of manual management. Raw new/delete is error-prone — prefer unique_ptr for exclusive ownership and shared_ptr for shared ownership. Smart pointers use RAII to make memory management automatic and safe.",
        practiceQuestions: [
          {
            question: 'What is a memory leak and when does it occur?',
            hint: 'Think about what happens when you allocate heap memory but never free it.',
            answer: 'A memory leak occurs when heap-allocated memory is never freed, causing the program to consume more and more RAM over time.',
          },
          {
            question: 'Why is unique_ptr called unique?',
            hint: 'Consider whether you can have two unique_ptrs pointing to the same object simultaneously.',
            answer: 'Because it enforces exclusive ownership — only one unique_ptr can own an object at a time; it cannot be copied, only moved.',
          },
          {
            question: 'What does RAII stand for, and why is it useful for pointers?',
            hint: 'Think about how smart pointers tie memory deallocation to object destruction.',
            answer: 'Resource Acquisition Is Initialization — resources are tied to object lifetimes, so they are automatically released when the object is destroyed, preventing leaks.',
          },
        ],
      },
      video: {
        videoId: 'e2LMAgoqY_k',
        title: 'Smart Pointers in C++ (unique_ptr, shared_ptr)',
        channelName: 'The Cherno',
      },
      quiz: [
        {
          question: 'Which smart pointer should you use for exclusive, non-shared ownership?',
          options: ['shared_ptr', 'weak_ptr', 'unique_ptr', 'auto_ptr'],
          correctAnswer: 'unique_ptr',
        },
        {
          question: 'What is the preferred way to create a unique_ptr in modern C++?',
          options: ['new unique_ptr<T>()', 'std::make_unique<T>()', 'unique_ptr<T>(new T())', 'std::create_unique<T>()'],
          correctAnswer: 'std::make_unique<T>()',
        },
        {
          question: 'When does a shared_ptr free its managed object?',
          options: [
            'When the first shared_ptr goes out of scope',
            'When delete is called manually',
            'When the last shared_ptr owning the object is destroyed',
            'Never — it must be freed manually',
          ],
          correctAnswer: 'When the last shared_ptr owning the object is destroyed',
        },
      ],
    },
  ],
};

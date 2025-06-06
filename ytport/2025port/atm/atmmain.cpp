#include<iostream>
#include<conio.h>
#include<fstream>
#include<windows.h>
using namespace std;

class bank {
    private:
    string name, address, phone, email,id, pass;
    int pin;
    float balance;

public:
    void menu();
    void bank_management();
    void atm_management();
    void new_user();

};
void bank::new_user() {
    ofstream file;
    file.open("users.txt", ios::app);
    cout << "Enter Name: ";
    cin >> name;
    cout << "Enter Address: ";
    cin >> address;
    cout << "Enter Phone: ";
    cin >> phone;
    cout << "Enter Email: ";
    cin >> email;
    cout << "Set PIN: ";
    cin >> pin;
    balance = 0; // Default balance for a new user

    file << name << " " << address << " " << phone << " " << email << " " << pin << " " << balance << "\n";
    file.close();
    cout << "\nUser registered successfully!";
}


void bank::menu() {
    char ch;
    string pin = "13366", pass, email;
    int choice;
    
    while (true) {
        system("cls");
        cout << "\n\n\t\t\tControl Panel";
        cout << "\n\n 1. Bank Management ";
        cout << "\n 2. ATM Management";
        cout << "\n 3. Exit";
        cout << "\n\n Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                system("cls");
                cout << "\n\n\t\t\tLogin Account";
                cout << "\n\n E-mail: ";
                cin >> email;
                cout << "\n\n\t\t\tPin Code: ";
                for (int i = 0; i < 5; i++) {
                    ch = getch();
                    pass += ch;
                    cout << "*";
                }
                if (email == "ak0978096@gmail.com" && pass == "14366") {
                    bank_management();
                } else {
                    cout << "\n\n Your email or pin is wrong";
                }
                break;
            case 2:
                atm_management();
                break;
            case 3:
                exit(0);
            default:
                cout << "Invalid choice, please try again";
                getch();
                break;
        }
    }
}

void bank::bank_management() {
    system("cls");
    cout << "\n\n\t\t\tBank Management System";
    cout << "\n\n 1. New User";
    cout << "\n 2. Already User";
    cout << "\n 3. Withdraw Money";
    cout << "\n 4. Transfer Money";
    cout << "\n 5. Payment Option";
    cout << "\n 6. Search User Record";
    cout << "\n 7. Edit User Record";
    cout << "\n 8. Delete User Record";
    cout << "\n 9. Show All Records";
    cout << "\n 10. Back to Main Menu";
    cout << "\n\n Enter your choice: ";
    int choice;
    cin >> choice;

    switch (choice) {
        case 1:
            // Logic for new user
            break;
        case 2: 
            // Logic for existing user
            break;
        // Add cases for other options
        case 10:
            menu();
            break;
        default:
            cout << "Invalid choice, please try again";
            getch();
            bank_management();
            break;
    }
}

void bank::atm_management() {
    system("cls");
    cout << "\n\n\t\t\tATM Management System";
    cout << "\n\n 1. Check Balance";
    cout << "\n 2. Deposit Money";
    cout << "\n 3. Withdraw Money";
    cout << "\n 4. Transfer Money";
    cout << "\n 5. Back to Main Menu";
    cout << "\n\n Enter your choice: ";
    int choice;
    cin >> choice;

    switch (choice) {
        case 1:
            
            break;
        case 2:
            break;
        case 5:
            menu();
            break;
        default:
            cout << "Invalid choice, please try again";
            getch();
            atm_management();
            break; 
    }
}

int main() {
    bank opj;
    opj.menu();
}

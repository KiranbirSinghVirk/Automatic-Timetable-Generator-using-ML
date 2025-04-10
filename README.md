# Automatic Timetable Generator using ML

## Overview
The **Automatic Timetable Generator** is a project designed to automate the creation of timetables for educational institutions. By leveraging machine learning, the system generates optimized timetables based on constraints such as teacher availability, subject requirements, and room allocations. This project aims to save time and reduce errors in manual scheduling.

## Features
- **Automated Timetable Generation**: Generate conflict-free timetables with minimal manual intervention.
- **Machine Learning Integration**: Uses a trained Random Forest model to predict and optimize scheduling.
- **Customizable Constraints**: Incorporates constraints like teacher preferences, subject priorities, and room capacities.
- **User-Friendly Interface**: A responsive frontend for managing and viewing timetables.
- **Database Integration**: Stores timetable data in a database for persistence.

## How It Works
1. **Input Data**: Users provide input data such as teacher availability, subjects, and room details.
2. **Data Processing**: The backend processes the input data and applies constraints.
3. **ML Model**: A Random Forest model predicts and optimizes the timetable based on the input data.
4. **Output**: The generated timetable is stored in the database and displayed to the user.

## Machine Learning Model
The project uses a **Random Forest Classifier** to solve the timetable generation problem. The model is trained on historical timetable data to learn patterns and constraints.

### How the Random Forest Model is Used
1. **Data Preparation**: Input data is preprocessed and encoded using `LabelEncoder` to convert categorical data (e.g., days, slots, branches) into numerical format.
2. **Model Training**: The Random Forest model is trained on features such as day, slot, branch, subject, faculty, room, and type of class (theory or lab). The target variable is whether a particular slot is assigned (`Assigned`).
3. **Timetable Prediction**: For new input data, the trained model predicts whether a slot should be assigned. The predictions are then post-processed to ensure constraints are satisfied.
4. **Integration**: The backend integrates the model and exposes APIs for timetable generation.

### Why Random Forest?
The Random Forest algorithm is well-suited for this project because:
- It handles categorical and numerical data effectively.
- It is robust to overfitting due to its ensemble nature.
- It provides high accuracy for classification tasks like predicting slot assignments.

## Installation and Setup
### Prerequisites
- Python 3.x
- Django
- scikit-learn
- pandas
- numpy
- Django REST Framework


For deliverable d2, this commit received a grade of 99%.

Test summary: 100% (50 passing, 0 failing, 0 skipped)
Line coverage: 89%



I updated addDataset methods so it can add room dataset
I added room_obj class and dataset_obj class.  
I updated perform_query amd filter and filter_helper methods so that it can perform query on room dataset. 

commits:  f23952381a660bf9441217c9cda4bc227c9fc32f
          431bee816303825e79d385727887a185032356a3
          


I think we did everything well if the goal is just to complete d2. We didn't use parse5 and we did something relatively spesific
to the room dataset so the program may not be albe to scale. We read the file every time we do query, which is a thing that can
be improved. 
